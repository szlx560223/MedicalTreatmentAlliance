<%@ WebHandler Language="C#" Class="HospitalHandler" %>

using System;
using System.Data.OleDb;
using System.Web;
using System.Collections.Generic;


public class HospitalHandler : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";

        try
        {
            // 获取查询参数
            string query = context.Request.QueryString["query"];
            if (string.IsNullOrEmpty(query))
            {
                context.Response.Write("[]");
                return;
            }

            // 连接到 Access 数据库
            string connectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\hospital_evaluate.mdb;";
            using (OleDbConnection conn = new OleDbConnection(connectionString))
            {
                conn.Open();

                string sqlQuery = "SELECT HospitalName FROM Hospitals WHERE HospitalName LIKE ?";
                using (OleDbCommand cmd = new OleDbCommand(sqlQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@query", "%" + query + "%");

                    OleDbDataReader reader = cmd.ExecuteReader();
                    List<string> hospitals = new List<string>();

                    while (reader.Read())
                    {
                        hospitals.Add(reader["HospitalName"].ToString());
                    }

                    // 返回 JSON 数据
                    string jsonResponse = Newtonsoft.Json.JsonConvert.SerializeObject(hospitals);
                    context.Response.Write(jsonResponse);
                }
            }
        }
        catch (Exception ex)
        {
            // 捕获所有异常并输出详细错误信息
            context.Response.StatusCode = 500;
            context.Response.Write("{\"status\":\"error\",\"message\":\"" + ex.Message + "\", \"stacktrace\":\"" + ex.StackTrace + "\"}");
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}
