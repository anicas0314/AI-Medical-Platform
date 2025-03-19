// Function to generate a welcome email template
export function getWelcomeTemplate({ name, company }) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Welcome!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.5; }
            .container { padding: 20px; background-color: #f4f4f4; border-radius: 5px; }
            h2 { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hello ${name}!</h2>
            <p>We're glad to have you on board at ${company}.</p>
            <p>Please reach out if you have any questions.</p>
          </div>
        </body>
      </html>
    `;
  }
  