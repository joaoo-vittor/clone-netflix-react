import './App.css';
import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import { MovieRow } from './components/MovieRow';
import { FeaturedMovie } from './components/FeaturedMovie';
import { NavHeader } from './components/NavHeader';

const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // All films
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // The best film
      let original = list.filter((item) => item.slug === 'orginals');
      let randomChosen = Math.floor(Math.random() * (original[0].items.results.length - 1));
      let chosen = original[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <NavHeader black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito com{' '}
        <span role="img" aria-label="coração">
          ❤️
        </span>{' '}
        por{' '}
        <a
          href="https://github.com/joaoo-vittor"
          style={{
            textDecoration: 'none',
          }}
        >
          João Vitor
        </a>
        <br />
        Direitos de imagem para Netflix <br />
        Dados pegos do site Themoviedb.org
      </footer>

      {movieList.length <= 0 && (
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
        </div>
      )}
    </div>
  );
};

export default App;
