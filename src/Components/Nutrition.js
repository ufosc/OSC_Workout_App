import React, { useState } from 'react';
import proteinData from '../proteinSources.json';

export default function Nutrition() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(proteinData.map(item => item.category))];

  const filteredItems = proteinData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Protein & Nutrition Library</h2>
      <p>Browse high-protein food sources and their protein content per serving.</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search food item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '8px', fontSize: '1rem' }}
        />
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '8px', fontSize: '1rem' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '16px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 6px 0' }}>{item.name}</h3>
              <span style={{ fontSize: '0.9rem', color: '#555' }}>
                Serving Size: {item.servingSize} | Category: {item.category}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2e7d32' }}>
                {item.proteinGrams}g
              </span>
              <div style={{ fontSize: '0.8rem', color: '#777' }}>Protein</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
