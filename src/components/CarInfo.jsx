import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Share } from '@mui/icons-material'; // Importing Material-UI icons

const CarInfo = () => {
    const { id } = useParams(); // Car ID from the URL
    const [car, setCar] = useState(null); // Car data
    const [rating, setRating] = useState(0); // User's rating for the car
    const [userId, setUserId] = useState(null); // User ID from JWT
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index
    const carInfoRef = useRef(null); // Reference to capture the car info container

    useEffect(() => {
        const fetchCarInfo = async () => {
            try {
                //const carResponse = await fetch(`http://localhost:5000/cardata/${id}`, { credentials: 'include' });
                const carResponse = await fetch(`https://crazycar-kxb4.onrender.com/cardata/${id}`, { credentials: 'include' });
                const data = await carResponse.json();
                setCar(data.car);
                setRating(data.rating);

                //const userResponse = await fetch('http://localhost:5000/auth/check', { credentials: 'include' });
                const userResponse = await fetch('https://crazycar-kxb4.onrender.com/auth/check', { credentials: 'include' });
                const userData = await userResponse.json();
                if (userData && userData.isLoggedIn) {
                    setUserId(userData.userId);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCarInfo();
    }, [id]);

    const onStarClick = async (newRating) => {
        setRating(newRating);
        try {
           // const response = await fetch('http://localhost:5000/rate', {
                const response = await fetch('https://crazycar-kxb4.onrender.com/rate', {    
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId: id, userId, rating: newRating }),
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                alert(result.message);
            } else {
                alert('Rating submitted successfully');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    if (!car) {
        return <div className='Loading'>
            <p>Please Login to View More Details</p>
        </div>;
    }

    const carName = car.brand + " " + car.model;

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.image.length) % car.image.length);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.image.length);
    };

    const currentImageUrl = `../../backend/${car.image[currentImageIndex]}`;

    // Download PDF function with landscape orientation
    const downloadPDF = () => {
        if (carInfoRef.current) {
            html2canvas(carInfoRef.current).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const doc = new jsPDF('landscape'); // 'landscape' orientation for PDF
                const imgWidth = doc.internal.pageSize.getWidth(); // get PDF width
                const imgHeight = (canvas.height * imgWidth) / canvas.width; // calculate height to maintain aspect ratio

                doc.addImage(imgData, 'PNG', 10, 10, imgWidth - 20, imgHeight - 20); // You can adjust dimensions
                doc.save(`crazycar_${car.brand}_${car.model}.pdf`);
            });
        }
    };

    // Share via WhatsApp function
    const shareWhatsApp = () => {
        const message = `Check out this car: ${carName}\nPrice: ${car.price}\n${car.description}\nMore details: http://localhost:3000/car/${id}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Share via Gmail function
    const shareEmail = () => {
        const subject = `Check out this car: ${carName}`;
        const body = `Hi,\n\nI found this car and thought you might be interested:\n\n${carName}\nPrice: ${car.price}\nDescription: ${car.description}\nMore details: http://localhost:3000/car/${id}`;
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
    };

    return (
        <>
            <div className="carinfoIinks">
                <Breadcrumbs aria-label="breadcrumb">
                    <NavLink to="/" className="carInfoLink">Home</NavLink>
                    <NavLink to='/car' className="carInfoLink">Car</NavLink>
                    <Typography sx={{ color: 'text.primary' }}>{carName}</Typography>
                </Breadcrumbs>
            </div>
            <div className="carinfoContainer" ref={carInfoRef}>
                <div className="mainContentContainer">
                    <div className="imageContainer" style={{ position: 'relative' }}>
                        <img src={currentImageUrl} alt={car.model} className="carinfoImage" />
                        <button 
                            onClick={handlePrevImage} 
                            style={{
                                position: 'absolute',
                                left: '1px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                            }}>&lt;</button>
                        <button 
                            onClick={handleNextImage} 
                            style={{
                                position: 'absolute',
                                right: '1px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                            }}>&gt;</button>
                    </div>
                    <div className="carDetailsContainer">
                        <h2 className="carinfoTitle">{carName}</h2>
                        <p className="carinfoPrice">Price: {car.price}</p>
                        <p className="carinfoDescription">{car.description}</p>

                        {userId && (
                            <div className="ratingStars">
                                <h3>Rate this Car:</h3>
                                <ReactStars
                                    count={5}
                                    isHalf={true}
                                    value={rating}
                                    onChange={onStarClick}
                                    size={40}
                                    activeColor="#ffd700"
                                />
                            </div>
                        )}
                        {!userId && <p>Please log in to rate this car.</p>}
                    </div>
                    <div className="downloadShareButtons" style={{ display: 'flex', alignItems: 'center',flexDirection:'row',margin: '0px 10px'}}>
                    <button onClick={downloadPDF} style={{ display: 'flex', alignItems: 'center',margin: '0px 10px',padding : '5px'}}>
                        <Download style={{ marginRight: '8px' }} />
                        Download Catalogue
                    </button>
                    <button onClick={shareWhatsApp} style={{ display: 'flex', alignItems: 'center',margin: '0px 10px',padding : '5px' }}>
                        <Share style={{ marginRight: '8px' }} />
                        Share on WhatsApp
                    </button>
                    {/* <button onClick={shareEmail} style={{ display: 'flex', alignItems: 'center',margin: '0px 10px',padding : '5px' }}>
                        <Share style={{ marginRight: '8px' }} />
                        Share via Email
                    </button> */}
                </div>
                </div>

                {/* Additional car info */}
                <div className="additionalInfoContainer">
                    <div className="infoItem"><strong>Fuel Type:</strong> <span>{car.fuelType}</span></div>
                    <div className="infoItem"><strong>Mileage:</strong> <span>{car.mileage}</span></div>
                    <div className="infoItem"><strong>Transmission:</strong> <span>{car.transmission}</span></div>
                    <div className="infoItem"><strong>Engine Capacity:</strong> <span>{car.engineCapacity}</span></div>
                    <div className="infoItem"><strong>Seating Capacity:</strong> <span>{car.seatingCapacity} people</span></div>
                    <div className="infoItem"><strong>Body Type:</strong> <span>{car.bodyType}</span></div>
                    <div className="infoItem"><strong>Safety Features:</strong> <span>{car.safetyFeatures.join(', ')}</span></div>
                    <div className="infoItem"><strong>Boot Space:</strong> <span>{car.bootSpace} liters</span></div>
                    <div className="infoItem"><strong>Additional Features:</strong> <span>{car.features.join(', ')}</span></div>
                    <div className="infoItem"><strong>Warranty:</strong> <span>{car.warranty}</span></div>
                </div>

                {/* Download and Share Buttons */}
          
            </div>
        </>
    );
};

export default CarInfo;
