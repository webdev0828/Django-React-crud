# Project Setup Instructions
To set up and run the project locally, follow these steps:
## Prerequisites
Ensure that you have the following installed: (I recommend installing the latest version.)
* Python 3.8+
* Django 3.2+
* Node.js and npm  8.5 +
## Database Setup
1. Install MySQL Installer 8.0+
2. Configure the MySQL Server to (The backend can access to database with this configuration)  
   User : root  
   Host : localhost  
   Port : 3307  
   Password : Dragonismygod1234567890123?  
3. Create a new database named "djangotest"
   * If you have MySQL management tool such as SQLyog or Navicat, you can create a new database manually.
   * Otherwise you can use this command.  
     mysql -u root -p  
     CREATE DATABASE project_db  
## Backend Setup (Django)
1.	Clone the Repository
git clone https://github.com/webdev0828/Django-React-crud.git  
cd project-name
2.	Create a Virtual Environment (optional but recommended)
In the project folder  
python -m venv venv  
source venv/bin/activate  # For Linux/macOS  
venv\Scripts\activate     # For Windows  
4.	Apply Migrations
cd djangoTest (Backend Folder)
pip install django  
pip install djangorestframework  
pip install djangorestframework-simplejwt  
pip install django-cors-headers  
pip install mysqlclient  
python manage.py migrate    
6.	Run the Development Server  
python manage.py runserver  
## Frontend Setup (React.js)  
1.	Navigate to the Frontend Directory:  
cd frontend  
2.	Install Dependencies  
npm install  
3.	Run the Frontend Server  
npm start

# Assumptions Made During Development
### User Authentication: 
JWT-based authentication is sufficient for securing API endpoints. Users must include the token in the header for all authenticated requests.
### Patient and Assessment management:
The application would need robust management features for both patients and assessments, allowing clinicians to create, read, update, and delete records with REST API.
### Data Relationships:
Proper relationships between patients, assessments, and clinicians would be necessary to maintain data integrity and facilitate efficient querying.
### Filtering:
Users would require dynamic filtering options for assessments based on various criteria (assessment type, patient name, date performed) to enhance data retrieval.
### Pagination and Sorting
Displaying large datasets necessitates pagination and sorting features to improve user experience and manage server load effectively.
### Multi-Tenancy
The application should support multi-tenancy, ensuring that each clinician can only access their own data, maintaining privacy and data security.

# Challenges Faced and How I Overcame Them
### Issue with Filtering and Pagination
Challenge:  
&nbsp;&nbsp;Combining filtering, sorting, and pagination with large datasets dynamically via query parameters was challenging.  
Solution:  
&nbsp;&nbsp;I used Django’s Paginator alongside efficient query handling using MySQL. Indexes were added to frequently queried fields (e.g., patient_name, assessment_type) to enhance performance.
### Handling CORS Issues
Challenge:  
&nbsp;&nbsp;CORS errors occurred when the frontend (running on a different port) was trying to communicate with the backend.  
Solution:  
&nbsp;&nbsp;Installed django-cors-headers and configured it to allow requests from specific origins during development. On the frontend, Axios was configured with proper headers to handle tokens.
### Managing JWT Expiration and Refresh
Challenge:  
&nbsp;&nbsp;Handling expired JWT tokens without forcing users to log in again.  
Solution:  
&nbsp;&nbsp;Implemented token refreshing on the frontend using an Axios interceptor. When the token expired, a refresh request was sent, and the new token was stored automatically.

# Additional Features and Improvements
### Enhanced Error Handling
Centralized error handling was implemented, including proper feedback for token expiration, validation errors, and network failures.
### Frontend Enhancements
Developed frontend user friendly and implemented client-side form validation to reduce the load on the backend.
### Multi-Tenancy
Added multi-tenancy features to ensure that clinicians only access their own patient and assessment data, preventing data leakage.

# Deployment Process to AWS
On AWS, you should set up EC2 for backend(Django), S3 for frontend(React.js) and RDS for MySQL.  
### Backend Setup
- On EC2 instance, you should set up Python environment using virtualenv.
  Then, clone my project from my github repository.
- Configure settings.py in the backend(Django) to connect to MySQL database on RDS - RDS endpoint, database name, username, password and mroe.  
  You should migrate after configuration like local - python manage.py migrate  
  To run backend in background, Gunicorn can be used.  
  Configure Nginx to act as a reverse proxy that forwards requests to Gunicorn
### Frontend Setup
- On local machine, generate a production build of frontend - npm run build
- S3 hosts React as a static website, so upload frontend content to S3 bucket  
  Then, configure the bucket for statkc website hosting - index.html for entry point.  
  AFter Backend setup and Frontend setup are finished, you should configure backend(Django) to allow CORS requests from frontend S3 domain.
### Domain and SSL Setup
- If you have a custom domain, you should manage DNS settings for both backend and frontend.  
- You can use AWS Certificate Manager to generate SSL certificates for the domain.  
