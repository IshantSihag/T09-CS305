const DownloadPdf = (email,areaOfJobSearch,data) => {
    let text = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume Review by Easecruit</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
    
            header {
                text-align: center;
                margin-bottom: 20px;
            }
    
            #logo {
                width: 100px;
                /* Adjust the width as needed */
            }
    
            #resume-review-info {
                text-align: center;
                margin-bottom: 30px;
            }
    
            h1 {
                color: #004080;
                /* Adjust the color as needed */
            }
    
            #download-button {
                display: block;
                margin: 20px auto;
                padding: 10px 20px;
                background-color: #004080;
                /* Adjust the color as needed */
                color: #ffffff;
                /* Adjust the color as needed */
                text-decoration: none;
                border-radius: 5px;
            }
    
            .resume-review-content {
                font-size: 20px;
                font-family: sans-serif;
                width:50vw
                white-space: pre-wrap; /* This property preserves both spaces and line breaks */
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .resume-review-content-container
            {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        </style>
    </head>
    
    <body>
        <header>
            <img id="logo"
                src="https://firebasestorage.googleapis.com/v0/b/dbms-project-cd015.appspot.com/o/images%2Feasecruit-logo1.jpg?alt=media&token=92caee94-e5df-4b84-8aeb-489936dabed2"
                alt="Easecruit Logo">
            <h1>Resume Review by Easecruit</h1>
        </header>
    
        <div id="resume-review-info">
            <h3>This AI resume review has been trained over 3000 resumes to provide valuable insights into your professional
                profile.</h3>
        </div>
    
        <div class="resume-review-content-container">
            <h3>Email : ${email}</h3>
            <h2>Area of Job Search - ${areaOfJobSearch}</h2>
            <p class="resume-review-content">${data}</p>
        </div>
    </body>
    
    </html>`


    return text;
}

export {DownloadPdf}