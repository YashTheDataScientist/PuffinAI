import React, { useState } from 'react';
import './HouseTips.css';

const ROOMS = [
  {
    key: 'bedroom',
    name: 'Bedroom',
    style: { left: '30%', top: '35%', width: '13%', height: '20%' },
    tips: [
      'Wash bedding weekly in hot water to reduce dust mites.',
      'Keep windows closed during high pollen seasons.',
      'Use an air purifier with a HEPA filter.',
      'Avoid keeping pets in the bedroom.'
    ]
  },
  {
    key: 'study',
    name: 'Study',
    style: { left: '42%', top: '35%', width: '18%', height: '20%' },
    tips: [
      'Keep bookshelves and surfaces dust-free.',
      'Ventilate regularly to prevent mold.',
      'Avoid carpets that trap allergens.'
    ]
  },
  {
    key: 'gardens',
    name: 'Garden',
    style: { left: '59%', top: '35%', width: '14%', height: '15%' },
    tips: [
      'Wash toys and bedding frequently.',
      'Keep stuffed animals to a minimum.',
      'Vacuum and clean floors regularly.'
    ]
  },
  {
    key: 'living',
    name: 'Living Room',
    style: { left: '30%', top: '52%', width: '16%', height: '28%' },
    tips: [
      'Vacuum carpets and sofas often.',
      'Keep indoor plants to a minimum to avoid mold.',
      'Use blinds instead of heavy curtains.'
    ]
  },
  {
    key: 'kitchen',
    name: 'Kitchen',
    style: { left: '45%', top: '52%', width: '15%', height: '28%' },
    tips: [
      'Clean sinks and counters to prevent mold.',
      'Store food in sealed containers.',
      'Take out trash regularly.'
    ]
  },
  {
    key: 'bathroom',
    name: 'Bathroom',
    style: { left: '59%', top: '49%', width: '12%', height: '18%' },
    tips: [
      'Use a dehumidifier or exhaust fan to reduce moisture.',
      'Clean tiles and grout to prevent mold.',
      'Wash bath mats frequently.'
    ]
  },
  {
    key: 'garage',
    name: 'Garage',
    style: { left: '59%', top: '65%', width: '14%', height: '16%' },
    tips: [
      'Store chemicals and paints in sealed containers.',
      'Keep the area well ventilated.',
      'Avoid storing old fabrics or papers.'
    ]
  }
];

const HouseTips = () => {
  const [activeRoom, setActiveRoom] = useState(null);

  return (
    <div className="house-tips-bg">
      <img src="/images/house.png" alt="House cross-section" className="house-img" />
      {ROOMS.map(room => (
        <button
          key={room.key}
          className="room-hotspot"
          style={room.style}
          onClick={() => setActiveRoom(room)}
          aria-label={room.name}
        />
      ))}
      {activeRoom && (
        <div className="room-popup-overlay" onClick={() => setActiveRoom(null)}>
          <div className="room-popup" onClick={e => e.stopPropagation()}>
            <h2>{activeRoom.name} Tips</h2>
            <ul>
              {activeRoom.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
            <button className="close-popup-btn" onClick={() => setActiveRoom(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseTips;
