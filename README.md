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