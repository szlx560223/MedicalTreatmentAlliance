<%@ WebHandler Language="C#" Class="ClientUpload" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Data.OleDb;
using System.Collections.Generic;
using System.Configuration;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;

using Trip.Controller;


public class Hospital
{
    public string ID { get; set; }
    public string 医院名称 { get; set; }
    public string 网址链接 { get; set; }
    public string 别名 { get; set; }
    public string 等级 { get; set; }
    public string 重点科室 { get; set; }
    public string 医院地址 { get; set; }
    public string 电话 { get; set; }
    //public string Link { get; set; }
}

public class ClientUpload : IHttpHandler
{
    string feedback = "";
    // 从配置文件获取连接字符串
    public static string connString;

    static ClientUpload()
    {
         string connectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\hospital2.mdb;";

        connString = connectionString;
    }

    // 存储数据库连接字符串
    //private string m_connectString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=";
    // 在类的成员变量中声明

    // 在类的成员变量中声明
    //private OleDbConnection m_oleConnection = null;
    //private OleDbCommand m_oleCommand = null;

    public void ProcessRequest(HttpContext context)
    {
        OleDbCommand m_oleCommand = null; // 在方法内部声明局部变量

        try
        {
            JObject jo = new JObject();
            // 处理从前端发来的GET请求
            if (context.Request.RequestType.ToLower() == "get")
            {

                // 处理GET请求的逻辑
            }
            // 处理POST请求
            else if (context.Request.RequestType.ToLower() == "post")
            {
                System.Diagnostics.Debug.WriteLine("POST "  );
                StreamReader sr = new StreamReader(context.Request.InputStream);
                string json = sr.ReadToEnd();
                JObject jr = JObject.Parse(json);

                string action = ((JToken)(jr["action"])).ToString();
                JObject requestData = (JObject)jr["data"];
                // 添加调试输出语句
                System.Diagnostics.Debug.WriteLine("Received Action: " + action);
                System.Diagnostics.Debug.WriteLine("Received Data: " + requestData.ToString());

                jo.Add("Action", action);
                jo.Add("Data", requestData);
                // 根据操作类型执行相应的操作
                if (action.Equals("filter_data"))
                {
                    // 获取 firstLevelSelected 和 secondLevelSelected 的值
                    string firstLevelSelected = requestData["firstLevelSelected"].ToString();

                    // 构建 SQL 查询语句，从症状查询表中获取医院名字
                    //string strSQL = "SELECT HospitalName FROM BL320 WHERE symptom = ? AND subSymptom = ?";
                    //string strSQL = "SELECT HospitalName FROM BL320 WHERE ID=1";
                    // 眼和附器疾病
                    string strSQL = "SELECT hospitalName FROM 肿瘤科 WHERE ID=1";

                    // 创建一个新的数据库连接对象
                    using (OleDbConnection oleConnection = new OleDbConnection(connString))
                    {
                        // 打开数据库连接
                        oleConnection.Open();
                        System.Diagnostics.Debug.WriteLine("Connection State before executing query: " + oleConnection.State);


                        // 创建一个新的数据库命令对象
                        using ( m_oleCommand = new OleDbCommand(strSQL, oleConnection))
                        {
                            // 添加参数并设置值
                            m_oleCommand.Parameters.AddWithValue("symptom", firstLevelSelected);
                          
                            // 输出参数信息
                            System.Diagnostics.Debug.WriteLine("Parameters added to command:");
                            System.Diagnostics.Debug.WriteLine("Parameter: symptom, Value: " + firstLevelSelected);
                    
                            using (OleDbDataReader oleReader = m_oleCommand.ExecuteReader())
                            {

                                DataTable dt = new DataTable();
                                dt.Load(oleReader);
                                // 输出实际执行的 SQL 查询语句
                                //System.Diagnostics.Debug.WriteLine("Actual SQL Query: " + strSQL);
                                // 输出结果行数
                                //System.Diagnostics.Debug.WriteLine("Result Rows Count: " + dt.Rows.Count);

                                if (dt.Rows.Count > 0)
                                {
                                    //string hospitalName = dt.Rows[0]["HospitalName"].ToString();

                                    // 构建 SQL 查询语句，从医院信息表中获取医院信息
                                    strSQL = "SELECT ID, 医院名称, 网址链接, 别名, 等级, 重点科室, 医院地址, 电话 FROM [" + firstLevelSelected + "] WHERE ID<9";

                                    m_oleCommand.CommandText = strSQL;

                                    using (OleDbDataReader oleReaderHospitalInfo = m_oleCommand.ExecuteReader())
                                    {
                                        DataTable dtHospitalInfo = new DataTable();
                                        dtHospitalInfo.Load(oleReaderHospitalInfo);


                                        // 如果查询结果为空，返回失败的 JSON 响应
                                        if (dtHospitalInfo.Rows.Count == 0)
                                        {
                                            Console.WriteLine("未找到医院信息。");
                                            // 构建失败的 JSON 响应
                                            JObject failureResponse = Failed(action, "未找到医院信息");

                                            // 设置响应内容类型为 application/json
                                            context.Response.ContentType = "application/json";

                                            // 将 JSON 响应写入响应输出流
                                            context.Response.Write(failureResponse.ToString());
                                        }
                                        else
                                        {
                                            List<Hospital> hospitals = new List<Hospital>();
                                            foreach (DataRow dr in dtHospitalInfo.Rows)
                                            {
                                                try
                                                {
                                                    Hospital hospital = new Hospital
                                                    {
                                                        ID = dr["ID"].ToString(),
                                                        医院名称 = dr["医院名称"].ToString(),
                                                        网址链接 = dr["网址链接"].ToString(),
                                                        别名 = dr["别名"].ToString(),
                                                        等级 = dr["等级"].ToString(),
                                                        重点科室 = dr["重点科室"].ToString(),
                                                        医院地址 = dr["医院地址"].ToString(),
                                                        电话 = dr["电话"].ToString(),
                                                        // Link = dr["Link"].ToString()
                                                    };


                                                    hospitals.Add(hospital);
                                                    // 调试信息：查看 hospitals 列表中的元素数量
                                                    System.Diagnostics.Debug.WriteLine("Number of hospitals in the list: " + hospitals.Count);
                                                }
                                                catch (Exception ex)
                                                {
                                                    Console.WriteLine("构建 Hospital 对象时出现异常：" + ex.Message);
                                                }
                                            }

                                            // 构建成功的 JSON 响应
                                            JObject successResponse = Succeed(action);
                                            string hospitalsJson = JsonConvert.SerializeObject(hospitals);
                                            JArray hospitalsArray = JArray.Parse(hospitalsJson);
                                            successResponse.Add("Result", hospitalsArray);

                                            // 设置响应内容类型为 application/json
                                            context.Response.ContentType = "application/json";

                                            // 将 JSON 响应写入响应输出流
                                            context.Response.Write(successResponse.ToString());
                                            // 调试信息：查看写入响应输出流的 JSON 内容
                                            System.Diagnostics.Debug.WriteLine("JSON Response: " + successResponse.ToString());
                                        }
                                    }
                                }
                                else
                                {
                                    // 如果查询结果为空，返回失败的 JSON 响应
                                    Console.WriteLine("未找到医院信息。");
                                    // 构建失败的 JSON 响应
                                    JObject failureResponse = Failed(action, "未找到医院信息");

                                    // 设置响应内容类型为 application/json
                                    context.Response.ContentType = "application/json";

                                    // 将 JSON 响应写入响应输出流
                                    context.Response.Write(failureResponse.ToString());
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine("发生异常：" + ex.Message);
            JObject failureResponse = Failed("exception", "发生异常：" + ex.Message);

            context.Response.ContentType = "application/json";
            context.Response.Write(failureResponse.ToString());

        }
        finally
        {
            // 在这里进行资源释放的操作
        }

        // 在这里进行资源释放的操作
        context.Response.Write(feedback ?? ""); // 确保 feedback 不为空引用

    }

    public JObject Failed(string action, string msg)
    {
        JObject jo = new JObject
        {
            { "Action", action },
            { "Msg", msg }
        };

        return jo;
    }

    // 分别返回表示成功和失败的JSON对象。
    public JObject Succeed(string action)
    {
        JObject jo = new JObject
        {
            { "Action", action },
            { "Msg", "Succeed" }
        };

        return jo;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}
