# Ani-Verse: AI-Powered Anime Recommendation Platform

## Overview
Ani-Verse is an advanced anime recommendation platform that delivers personalized suggestions based on user preferences. It incorporates sophisticated NLP techniques and recommendation systems.

The project involves scraping MyAnimeList using Scrapy, processing the collected metadata with NLP techniques, and leveraging BERT-generated CLS embeddings for efficient search and recommendation using FAISS. A multi-armed bandit algorithm with Upper Confidence Bound (UCB) is employed to dynamically refine recommendations based on user feedback.

## Key Features

- **Anime Metadata Collection:** Web scraper built with Scrapy to extract metadata from MyAnimeList (one-time process).
- **Data Processing:** Cleaned and preprocessed 14,000+ anime titles using Pandas and NLTK.
- **Embeddings Generation:** Utilized a BERT model to generate CLS embeddings for each anime.
- **Efficient Search Indexing:** Stored embeddings in FAISS (Facebook AI Similarity Search) for fast nearest-neighbor lookups.
- **Personalized Recommendations:** Implemented a multi-armed bandit (UCB) algorithm to refine anime suggestions dynamically.
- **User Interaction:** Users can rate recommendations, helping refine new suggestions.
- **User Features:** Users can save anime to lists like favorites or watch later and showcase a highlighted favorite anime on their profile.

## Tech Stack

- **Frontend:** React
- **Backend:** Django + Django REST Framework
- **Database:** MySQL
- **Search & Embeddings:** FAISS (Approximate Nearest Neighbor Search) + BERT (for CLS embeddings)
- **NLP & Preprocessing:** Scrapy (for web scraping), Pandas, and NLTK
- **Recommendation Engine:** Multi-Armed Bandit (UCB) Algorithm

## Project Structure

```
├── backend
│   ├── .gitignore
│   ├── .venv
│   ├── api
│   │   ├── api
│   │   ├── auth_api
│   │   ├── core
│   │   ├── db.sqlite3
│   │   ├── manage.py
│   │   ├── media
│   │   ├── profiles_api
│   │   ├── recommendations_api
│   │   └── rough.ipynb
│   ├── data
│   ├── embeddings
│   │   ├── data
│   │   └── experiment
│   ├── requirements.txt
│   └── rough.ipynb
├── frontend
│   ├── anisite
│   │   ├── .gitignore
│   │   ├── README.md
│   │   ├── eslint.config.js
│   │   ├── index.html
│   │   ├── node_modules
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── src
│   │   ├── tailwind.config.js
│   │   └── vite.config.js
│   └── package-lock.json
```

## Installation Guide

### Backend Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/manoj-323/ani-verse.git
    cd ani-verse/backend
    ```

2. **Create and activate a virtual environment:**
    ```sh
    python -m venv venv
    source venv/bin/activate   # Linux/Mac
    venv\Scripts\activate      # Windows
    ```

3. **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4. **Configure MySQL database settings** in `settings.py` and apply migrations:
    ```sh
    python manage.py migrate
    ```

5. **Start the backend server:**
    ```sh
    python manage.py runserver
    ```

### Frontend Setup

1. **Navigate to the frontend directory:**
    ```sh
    cd ../frontend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Start the frontend server:**
    ```sh
    npm start
    ```

## How It Was Made

1. **Web Scraping:**
   - A Scrapy-based scraper extracts anime metadata from MyAnimeList.
   - The collected dataset (originally 24,000+ anime, reduced to 14,000+ after preprocessing) is stored in MySQL for further processing.

2. **Data Preprocessing & Embedding Generation:**
   - The dataset is cleaned and preprocessed using Pandas & NLTK.
   - Each anime is passed through a BERT model to generate CLS embeddings.
   - These embeddings are stored in a FAISS index for efficient similarity search.

3. **Recommendation Engine:**
   - When a user requests recommendations, the system retrieves similar anime using FAISS nearest neighbor search.
   - The multi-armed bandit algorithm (Upper Confidence Bound - UCB) dynamically adjusts recommendations based on user interactions and ratings.

4. **User Interaction:**
   - Users can browse recommendations and explore anime based on preferences and searches.

## Contributions

- **Backend Development:** Web scraping (Scrapy), NLP processing, BERT embeddings, FAISS indexing, and multi-armed bandit recommendation engine (**Collaborative Work**).
- **Frontend Development:** User interface, React integration, and UX improvements (**Collaborative Work**).

## Future Enhancements

- Improve NLP techniques for better anime similarity matching.
- Implement collaborative filtering alongside content-based recommendations.
- Deploy as a live web application with user authentication.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **MyAnimeList** for providing the dataset for anime metadata.
- **FAISS & BERT** for enabling an efficient recommendation system.
- **My collaborator** for contributing to the frontend and backend development.

