import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

function OrderCard( {message, orderId, total_orders, sum_price} ) {
    const navigate = useNavigate();
    const handleCart = async () => {
        navigate("/client-dashboard" );
      }; 
  return (
    <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }} // Ocupă întreaga înălțime a ecranului
    >
        <Card className="text-center" style={{ width: "50%", padding: "20px" }}>
        <Card.Title>{message}</Card.Title>
        <Card.Body>
            <Card.Text>Your order has been successfully placed. We will keep you updated via email and contact you by phone when your package arrives.</Card.Text>
            <Card.Text>Order Number: {total_orders}</Card.Text>
            <Card.Text>Total Price: {sum_price} Lei</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
        <Button bg="dark" variant="dark" onClick={handleCart}>Go to Homepage</Button>
        </Card.Footer>
        </Card>
  </div>
    
    );
}

export default OrderCard;