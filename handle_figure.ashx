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
using System;
using System.Data.OleDb;
using System.IO;
using Newtonsoft.Json.Linq;

public class Student
{
    public string Name { get; set; }
    public int Count { get; set; }
}


public class ClientUpload : IHttpHandler
{
    public static string connString;

    // 定义20个变量
    int overallVeryDissatisfied = 0;
    int overallDissatisfied = 0;
    int overallNeutral = 0;
    int overallSatisfied = 0;
    int overallVerySatisfied = 0;

    int serviceVeryPoor = 0;
    int servicePoor = 0;
    int serviceNeutral = 0;
    int serviceGood = 0;
    int serviceExcellent = 0;

    int facilitiesVeryPoor = 0;
    int facilitiesPoor = 0;
    int facilitiesNeutral = 0;
    int facilitiesGood = 0;
    int facilitiesExcellent = 0;

    int cleanlinessVeryPoor = 0;
    int cleanlinessPoor = 0;
    int cleanlinessNeutral = 0;
    int cleanlinessGood = 0;
    int cleanlinessExcellent = 0;

    static ClientUpload()
    {
        // 直接指定连接字符串
        string connectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\hospital_evaluate.mdb;";

        connString = connectionString;
    }

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            if (context.Request.RequestType.ToLower() == "post")
            {
                System.Diagnostics.Debug.WriteLine("POST");

                // 读取请求体
                using (StreamReader sr = new StreamReader(context.Request.InputStream))
                {
                    string json = sr.ReadToEnd();
                    JObject jr = JObject.Parse(json);

                    // 调试输出接收到的 JSON 数据
                    System.Diagnostics.Debug.WriteLine("Received JSON: " + json);

                    // 获取 "hospitalName" 的值
                    string hospitalName = (string)jr["hospitalName"];

                    // 调试输出 hospitalName 的值
                    System.Diagnostics.Debug.WriteLine("Received hospitalName: " + hospitalName);

                    // 查询统计数据的 SQL 语句
                    string strSQL = @"
                    SELECT 'OverallRating' AS [RatingType], [OverallRating] AS [Rating], COUNT(*) AS [Count]
                    FROM Evaluations
                    WHERE [Hospital] = ?
                    GROUP BY [OverallRating]

                    UNION ALL

                    SELECT 'ServiceRating' AS [RatingType], [ServiceRating] AS [Rating], COUNT(*) AS [Count]
                    FROM Evaluations
                    WHERE [Hospital] = ?
                    GROUP BY [ServiceRating]

                    UNION ALL

                    SELECT 'FacilitiesRating' AS [RatingType], [FacilitiesRating] AS [Rating], COUNT(*) AS [Count]
                    FROM Evaluations
                    WHERE [Hospital] = ?
                    GROUP BY [FacilitiesRating]

                    UNION ALL

                    SELECT 'CleanlinessRating' AS [RatingType], [CleanlinessRating] AS [Rating], COUNT(*) AS [Count]
                    FROM Evaluations
                    WHERE [Hospital] = ?
                    GROUP BY [CleanlinessRating]";

                    System.Diagnostics.Debug.WriteLine("SQL Query: " + strSQL);

                    using (OleDbConnection oleConnection = new OleDbConnection(connString))
                    {
                        oleConnection.Open();
                        System.Diagnostics.Debug.WriteLine("Connection State before executing query: " + oleConnection.State);

                        using (OleDbCommand m_oleCommand = new OleDbCommand(strSQL, oleConnection))
                        {
                            // 确保为每个占位符添加相同的参数
                            m_oleCommand.Parameters.Add(new OleDbParameter("?", OleDbType.VarChar) { Value = hospitalName });
                            m_oleCommand.Parameters.Add(new OleDbParameter("?", OleDbType.VarChar) { Value = hospitalName });
                            m_oleCommand.Parameters.Add(new OleDbParameter("?", OleDbType.VarChar) { Value = hospitalName });
                            m_oleCommand.Parameters.Add(new OleDbParameter("?", OleDbType.VarChar) { Value = hospitalName });

                            // 打印参数信息
                            System.Diagnostics.Debug.WriteLine("Number of Parameters: " + m_oleCommand.Parameters.Count);
                            for (int i = 0; i < m_oleCommand.Parameters.Count; i++)
                            {
                                var param = m_oleCommand.Parameters[i];
                                System.Diagnostics.Debug.WriteLine("Parameter " + i + ": Name=" + param.ParameterName + ", Value=" + param.Value + ", Type=" + param.OleDbType);
                            }


                            using (OleDbDataReader oleReader = m_oleCommand.ExecuteReader())
                            {

                                System.Diagnostics.Debug.WriteLine("Reading data...");
                                while (oleReader.Read())
                                {
                                    string ratingType = oleReader["RatingType"].ToString();
                                    int rating = Convert.ToInt32(oleReader["Rating"]);
                                    int count = Convert.ToInt32(oleReader["Count"]);
                                    // 处理数据逻辑
                                    Console.WriteLine("RatingType: " + ratingType + ", Rating: " + rating + ", Count: " + count);

                                    switch (ratingType)
                                    {
                                        case "OverallRating":
                                            switch (rating)
                                            {
                                                case 1: overallVeryDissatisfied += count; break;
                                                case 2: overallDissatisfied += count; break;
                                                case 3: overallNeutral += count; break;
                                                case 4: overallSatisfied += count; break;
                                                case 5: overallVerySatisfied += count; break;
                                            }
                                            break;

                                        case "ServiceRating":
                                            switch (rating)
                                            {
                                                case 1: serviceVeryPoor += count; break;
                                                case 2: servicePoor += count; break;
                                                case 3: serviceNeutral += count; break;
                                                case 4: serviceGood += count; break;
                                                case 5: serviceExcellent += count; break;
                                            }
                                            break;

                                        case "FacilitiesRating":
                                            switch (rating)
                                            {
                                                case 1: facilitiesVeryPoor += count; break;
                                                case 2: facilitiesPoor += count; break;
                                                case 3: facilitiesNeutral += count; break;
                                                case 4: facilitiesGood += count; break;
                                                case 5: facilitiesExcellent += count; break;
                                            }
                                            break;

                                        case "CleanlinessRating":
                                            switch (rating)
                                            {
                                                case 1: cleanlinessVeryPoor += count; break;
                                                case 2: cleanlinessPoor += count; break;
                                                case 3: cleanlinessNeutral += count; break;
                                                case 4: cleanlinessGood += count; break;
                                                case 5: cleanlinessExcellent += count; break;
                                            }
                                            break;
                                    }
                                }
                            }
                        }
                    }

                    // 创建数据库连接
                    string connectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\hospital_evaluate.mdb;";

                    using (OleDbConnection connection = new OleDbConnection(connectionString))
                    {
                        connection.Open();

                        // 更新总体满意度选项
                        UpdateOption(connection, "OverallVeryDissatisfied", overallVeryDissatisfied);
                        UpdateOption(connection, "OverallDissatisfied", overallDissatisfied);
                        UpdateOption(connection, "OverallNeutral", overallNeutral);
                        UpdateOption(connection, "OverallSatisfied", overallSatisfied);
                        UpdateOption(connection, "OverallVerySatisfied", overallVerySatisfied);

                        // 更新服务态度选项
                        UpdateOption(connection, "ServiceVeryPoor", serviceVeryPoor);
                        UpdateOption(connection, "ServicePoor", servicePoor);
                        UpdateOption(connection, "ServiceNeutral", serviceNeutral);
                        UpdateOption(connection, "ServiceGood", serviceGood);
                        UpdateOption(connection, "ServiceExcellent", serviceExcellent);

                        // 更新设施设备选项
                        UpdateOption(connection, "FacilitiesVeryPoor", facilitiesVeryPoor);
                        UpdateOption(connection, "FacilitiesPoor", facilitiesPoor);
                        UpdateOption(connection, "FacilitiesNeutral", facilitiesNeutral);
                        UpdateOption(connection, "FacilitiesGood", facilitiesGood);
                        UpdateOption(connection, "FacilitiesExcellent", facilitiesExcellent);

                        // 更新环境卫生选项
                        UpdateOption(connection, "CleanlinessVeryPoor", cleanlinessVeryPoor);
                        UpdateOption(connection, "CleanlinessPoor", cleanlinessPoor);
                        UpdateOption(connection, "CleanlinessNeutral", cleanlinessNeutral);
                        UpdateOption(connection, "CleanlinessGood", cleanlinessGood);
                        UpdateOption(connection, "CleanlinessExcellent", cleanlinessExcellent);
                        
                        

                        using (OleDbConnection oleConnection = new OleDbConnection(connString))
                        {
                            oleConnection.Open();
                            System.Diagnostics.Debug.WriteLine("Connection State before executing query: " + oleConnection.State);
                            string strrSQL = "SELECT Name, Count FROM Evaluation";

                            using (OleDbCommand m_oleCommand = new OleDbCommand(strrSQL, oleConnection))
                            {
                                using (OleDbDataReader oleReader = m_oleCommand.ExecuteReader())
                                {
                                    DataTable dt = new DataTable();
                                    dt.Load(oleReader);

                                    if (dt.Rows.Count > 0)
                                    {
                                        List<Student> students = new List<Student>();
                                        foreach (DataRow dr in dt.Rows)
                                        {
                                            try
                                            {
                                                Student student = new Student
                                                {
                                                    Name = dr["Name"].ToString(),
                                                    Count = Convert.ToInt32(dr["Count"])
                                                };
                                                students.Add(student);
                                            }
                                            catch (Exception ex)
                                            {
                                                System.Diagnostics.Debug.WriteLine("Error while constructing Student object: " + ex.Message);
                                            }
                                        }

                                        JObject successResponse = Succeed();
                                        successResponse.Add("Result", JArray.FromObject(students));

                                        context.Response.ContentType = "application/json";
                                        context.Response.Write(successResponse.ToString());
                                    }
                                    else
                                    {
                                        JObject failureResponse = Failed("No data found");
                                        context.Response.ContentType = "application/json";
                                        context.Response.Write(failureResponse.ToString());
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }

        catch (Exception ex)
        {
            JObject errorResponse = Failed(ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.Write(errorResponse.ToString());
            System.Diagnostics.Debug.WriteLine("Exception: " + ex.Message);
        }
    }


    private void UpdateOption(OleDbConnection connection, string optionName, int count)
    {
        // 确保字段名与数据库表中的实际字段名一致
        string query = "UPDATE Evaluation SET [Count] = ? WHERE [option] = ?";

        using (OleDbCommand command = new OleDbCommand(query, connection))
        {
            // 添加参数，顺序要与查询中的 ? 一致
            command.Parameters.AddWithValue("?", count);
            command.Parameters.AddWithValue("?", optionName);

            try
            {
                // 执行更新命令
                int rowsAffected = command.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                // 捕捉和打印异常信息
                System.Diagnostics.Debug.WriteLine("Exception: " + ex.Message);
            }
        }
    }
        public JObject Failed(string msg)
    {
        JObject jo = new JObject
        {
            { "Msg", msg }
        };

        return jo;
    }
    public JObject Succeed()
    {
        return new JObject
        {
            { "Status", "Success" },
            { "Message", "Request succeeded" }
        };
    }

    public bool IsReusable
    {
        get { return false; }
    }

}
