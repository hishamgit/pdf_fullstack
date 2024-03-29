# pdf_fullstack
A web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack that allows users to upload a PDF file and extract certain pages from the PDF to create a new PDF. The user is able to select which pages they want to include in the new PDF.Users can also see their previous pdfs uploaded.

## Features

- User authentication and authorization system.
- PDF file upload functionality.
- PDF preview and page selection interface.
- Extraction of selected pages to create a new PDF.
- View previous PDF uploads.
- Responsive and intuitive user interface.

## Technologies Used

- MongoDB: NoSQL database for storing user data.
- Express.js: Node.js framework for building the backend RESTful API.
- React.js: Frontend library for building interactive user interfaces.
- Node.js: JavaScript runtime environment for running server-side code.

## Installation

1. Clone the repository:

   ```bash
   https://github.com/hishamgit/pdf_fullstack.git
2. Navigate to the project directory:
   ```bash
   cd pdf_fullstack
   cd backend
3. Create a config.js file add JWT_PRIVATE_KEY , mongoDBUrl , PORT. (in backend folder)
   
   eg.
   ```bash
   export const PORT= <PORT-NO> ;
   export const mongoDBUrl= <Your MongoDB connection URL> ;
   export const JWT_PRIVATE_KEY= < secret key used by jwt , put any string> ;
4. Install dependencies for the server  (in backend folder):
   ```bash
   npm install
5. Create a folder with name "uploads" to store pdfs.  (in backend folder)
6. Start the server: (in backend folder)
   ```bash
   npm run dev
7. Navigate to the client directory from backend:
   ```bash
   cd ../frontend
8. Install dependencies for the client:
   ```bash
   npm install
9. Start the client:
    ```bash
    npm run dev
10. Open your browser and navigate to http://localhost:5173/ to view the application.

## Usage

- Register or log in to the application.
- Upload a PDF file using the provided file input.
- Select the pages you want to include in the new PDF.
- Click the "Make pdf" button to extract the selected pages and create a new PDF.
- View your previously uploaded PDFs by clicking the "Previous Pdfs" button.
