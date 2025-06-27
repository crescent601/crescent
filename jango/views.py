from django.http import HttpResponse
from django.shortcuts import render




def homepage(request):
    return HttpResponse("Hello This Is My Side")

# Get the BASE directory of your Django project
#BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

#def get_sheet_data():
 #   """Fetch Google Sheets data"""
  #  try:
   #     # Define the scope for Google Sheets API
#    #    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
#
#       # Construct the full path to credentials.json
#        creds_path = os.path.join(BASE_DIR, "Service Account Final.json")
#
#        # Load credentials from the file
#        creds = ServiceAccountCredentials.from_json_keyfile_name(creds_path, scope)
#
#        # Authorize and connect to Google Sheets
#        client = gspread.authorize(creds)

#       # Open the Google Sheet by URL
#        sheet_id = "1ghQibvv3WHyfTJsOPxWP1dPyyaTpkgfa"
#        sheet = client.open_by_key(sheet_id).sheet1  # or .worksheet('Sheet1')
#        data = sheet.get_all_values()
#        if not data:
#                return "<p>No data available.</p>"  # Return empty message if no data
#
#        headers = data[0]  # First row as column headers
#        rows = data[1:]  # Remaining rows as data
#
#        # Convert to Pandas DataFrame
#        df = pd.DataFrame(rows, columns=headers)

        # Extract unique Employee Names & Months for dropdowns
#        employee_names = sorted(df["Employee Name"].unique())
#        months = sorted(df["Month"].unique())

        # Print DataFrame to console for debugging
#        print("Google Sheets Data (as DataFrame):")
#        print(df)

         # Convert DataFrame to HTML table
 #       df_html = df.to_html(classes="table table-bordered", index=False, escape=False)

  #      return df_html,employee_names,months  # Return HTML string


#    except Exception as e:
#        print(f"Error fetching data: {str(e)}")
#        return "<p>Error fetching data.</p>"
    
#def homepage(request):
#    """Render homepage with API and Google Sheets data"""
#    # Fetch API data
#    response = requests.get('https://jsonplaceholder.typicode.com/posts/1')
#    api_data = response.json()  # Convert response to JSON
#
    # Fetch Google Sheets data
#    sheet_data_html, employee_names, months = get_sheet_data()

    # Pass both data sources to template
#    return render(request, "index.html", {
#         'api_data': api_data, 
#         'sheet_data_html': sheet_data_html,
#         'employee_names': employee_names,
#         'months': months 
#    })

