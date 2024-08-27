<%@ WebHandler Language="C#" Class="HandleEvaluate" %>

using System;
using System.Data.OleDb;
using System.Web;

public class HandleEvaluate : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";

        string hospital = context.Request.Form["hospital"];
        string overallRating = context.Request.Form["overallRating"];
        string serviceRating = context.Request.Form["serviceRating"];
        string facilitiesRating = context.Request.Form["facilitiesRating"];
        string cleanlinessRating = context.Request.Form["cleanlinessRating"];
        string comments = context.Request.Form["comments"];

        string connectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\hospital_evaluate.mdb;";
        using (OleDbConnection connection = new OleDbConnection(connectionString))
        {
            string query = "INSERT INTO Evaluations (Hospital, OverallRating, ServiceRating, FacilitiesRating, CleanlinessRating, Comments) VALUES (?, ?, ?, ?, ?, ?)";
            using (OleDbCommand command = new OleDbCommand(query, connection))
            {
                command.Parameters.AddWithValue("?", hospital);
                command.Parameters.AddWithValue("?", overallRating);
                command.Parameters.AddWithValue("?", serviceRating);
                command.Parameters.AddWithValue("?", facilitiesRating);
                command.Parameters.AddWithValue("?", cleanlinessRating);
                command.Parameters.AddWithValue("?", comments);

                try
                {
                    connection.Open();
                    command.ExecuteNonQuery();
                    context.Response.Write("{\"status\":\"success\"}");
                }
                catch (Exception ex)
                {
                    context.Response.Write("{\"status\":\"error\",\"message\":\"" + ex.Message + "\"}");
                }
            }
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}

