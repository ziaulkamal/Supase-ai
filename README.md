# Schématique

Schématique is a powerful tool designed for automating content creation and scheduling. It integrates various functionalities to streamline your content management processes. 

## Features

- 📅 **Auto Create Content Schedule**  
  Automatically generate and manage your content calendar.

- 📝 **Content Generate By Keyword**  
  Create content based on specific keywords to enhance relevance and SEO.

- 🌐 **Content Generate By Google Trends**  
  Generate content ideas and topics based on current Google Trends.

- 🖼️ **Image Source From Search Engine**  
  Source images directly from search engines to complement your content.

- 🚀 **Running On Vercel And Self Hosted**  
  Deploy your application on Vercel for ease of use or host it on your own server.

- 🔄 **Set And Forget Method**  
  Configure the tool once and let it run automatically with minimal intervention.

- 📲 **Control Using Telegram**  
  Manage and control your content creation and scheduling via Telegram for convenience.

## Getting Started

To get started with Schématique, follow these steps:
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/schematique.git
   cd schematique
   ```
2. **Install Dependencies**  
    ```bash
    npm install
    ```
3. **Configure Environment Variables**  
    Create a `.env` file in the root directory of your project based on the provided `.env.local` file. This file should contain your environment-specific settings.
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
    NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
    TELEGRAM_TOKEN=your-telegram-token
    USER_ID=your-user-id
    BASE_URL=http://localhost:3000
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    LANGUAGE=US
    ```
    
### Setting Up Environment Variables in Vercel

1. **Log in to Vercel**
   - Go to the [Vercel Dashboard](https://vercel.com/dashboard) and log in to your account.

2. **Select Your Project**
   - Choose the project you want to configure from the list.

3. **Go to Project Settings**
   - Click on the project name to open the project page.
   - Select the **Settings** tab at the top of the page.

4. **Navigate to Environment Variables**
   - On the left sidebar, click on **Environment Variables**. This will open the page where you can add and manage environment variables.

5. **Add Environment Variables**
   - Click on the **Add** button to create a new environment variable.
   - Enter the following details:
     - **Name:** The name of the environment variable, e.g., `NEXT_PUBLIC_SUPABASE_URL`.
     - **Value:** The value of the environment variable, e.g., `https://your-supabase-url.supabase.co`.
     - **Environment:** Select where the variable will be used:
       - **Development:** For the development environment.
       - **Preview:** For the preview environment.
       - **Production:** For the production environment.
   - Click **Add** to save the environment variable.

6. **Review and Save**
   - Ensure all variables are correct.
   - Vercel will automatically apply these changes. You may need to redeploy your application for the changes to take effect.
