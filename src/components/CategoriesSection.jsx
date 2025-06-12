import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Hoddies', slug: 'hoddies', image:'/assets/images/hoodie-1.png' },
  { id: 2, name: 'Caps', slug: 'caps', image: '/assets/images/cap-2.png' },
  { id: 3, name: 'T-shirts', slug: 'tshirts', image: '/assets/images/cap-3.png' },
  {id: 4, name: 'Jeezy', slug: 'jeezy', image: '/assets/images/red jeezy.jfif'}
];

const CategoriesSection = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">Shop by Category</h2>
        <div className="row row-cols-2 row-cols-md-4 g-4 justify-content-center">
          {categories.map(category => (
            <div className="col" key={category.id}>
              <Link 
                to={`/categories/${category.slug}`} 
                className="text-decoration-none text-dark"
              >
                <div className="card border-0 shadow-sm h-100">
                  <img 
                    src={category.image} 
                    className="card-img-top" 
                    alt={category.name}
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
