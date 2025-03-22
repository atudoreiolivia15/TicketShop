import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

function EventCard({event, onPurchase, index}) {
  const [images] = useState([
    'image1.jpg',
    'image3.jpg',
    'image2.jpg',
    'image6.jpg',
    'image4.jpg', 
    'image5.jpg',
  ]);
  const getImageForEvent = () => {
    const i = index % images.length; // id- il folosim drept indice
    console.log('Image Path:', index); 
    return `${process.env.PUBLIC_URL}/events_images/${images[i]}`;
  };
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={getImageForEvent()}/>
      <Card.Body>
        <Card.Title>{event.name}</Card.Title>
        <Card.Text>
          {event.description}
        </Card.Text>
        <Card.Text>
          {event.location}
        </Card.Text>
        <Card.Text>
          {event.date}
        </Card.Text>
        <Button variant="primary" onClick={() => onPurchase(event.id)}>
        Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default EventCard;