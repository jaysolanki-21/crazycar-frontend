import React, { useState, useEffect } from 'react';
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import Car from './Car';
import Pagination from '@mui/material/Pagination';

function Cars() {
    const [originalCarsData, setOriginalCarsData] = useState([]);
    const [carsData, setCarsData] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 10;

    // Fetch car data on initial render
    useEffect(() => {
        const fetchCarData = async () => {
            try {
                //const response = await fetch('http://localhost:5000/cardata');
                const response = await fetch('https://crazycar-kxb4.onrender.com/cardata');

                
                const data = await response.json();
                setOriginalCarsData(data);
                setCarsData(data);

                const uniqueBrands = Array.from(new Set(data.map(car => car.brand)));
                setBrands(uniqueBrands);

                const uniqueModels = Array.from(new Set(data.map(car => car.model)));
                setModels(uniqueModels);
            } catch (error) {
                console.error('Error fetching car data:', error);
            }
        };
        fetchCarData();
    }, []);

    // Filter models when a brand is selected
    useEffect(() => {
        if (selectedBrand) {
            const filteredModels = originalCarsData
                .filter(car => car.brand === selectedBrand)
                .map(car => car.model);
            setModels(Array.from(new Set(filteredModels)));
        } else {
            const uniqueModels = Array.from(new Set(originalCarsData.map(car => car.model)));
            setModels(uniqueModels);
        }
    }, [selectedBrand, originalCarsData]);

    // Handle search/filter
    const handleSearch = () => {
        const filteredCars = originalCarsData.filter(car =>
            (selectedBrand ? car.brand === selectedBrand : true) &&
            (selectedModel ? car.model === selectedModel : true)
        );
        setCarsData(filteredCars);
        setCurrentPage(1); // Reset to first page after filtering
    };

    // Pagination Logic
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = carsData.slice(indexOfFirstCar, indexOfLastCar);

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="carFirst">
                <div className="searchCar">
                    <div className="carHeading">
                        <h1>Buying your dream car? <br /> Check Now!</h1>
                    </div>
                    <div className="searchDetail">
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option.value === value.value} // To avoid warning in console
                            disableClearable
                            className='searchTxt'
                            disablePortal
                            options={brands}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Select Brand" />}
                            value={selectedBrand}
                            onChange={(e, newVal) => {
                                setSelectedBrand(newVal);
                                setSelectedModel('');
                            }}
                        />
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option.value === value.value} // To avoid warning in console
                            disableClearable
                            className='searchTxt'
                            disablePortal
                            options={models}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Select Model" />}
                            value={selectedModel}
                            onChange={(e, newVal) => setSelectedModel(newVal)}
                        />
                        <button className='Btn' onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="carsFilter">
                <div className="byPrice">
                    <select name="" id="" className='selectionList'>
                        <option value="">1 Lakh to 5 Lakh</option>
                        <option value="">5 Lakh to 10 Lakh</option>
                        <option value="">15 Lakh to 15 Lakh</option>
                        <option value="">15 Lakh to 20 Lakh</option>
                        <option value="">20 Lakh to 25 Lakh</option>
                    </select>
                </div>


                <div className="filterBtns">
                    <button className='Btn'>Apply Filter</button>
                    <button className='ClearBtn'>Clear Filter</button>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '20px',
                    margin: '20px',
                    padding: '20px',
                    boxSizing: 'border-box',
                }}
            >
                {
                    carsData.length === 0 ? (
                        <div className='Loading'>
                            <CircularProgress />
                        </div>
                    ) : (
                        currentCars.map((car) => (
                            <Car
                                key={car._id}
                                id={car._id}
                                image={car.image}
                                title={`${car.brand} ${car.model}`}
                                price={`₹ ${car.price}`}
                                year={car.year}
                                fuelType={car.fuelType}
                                mileage={car.mileage}
                                description={car.description}
                            />
                        ))
                    )
                }
            </div>

            <div className="pagination">
                <Pagination
                    count={Math.ceil(carsData.length / carsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    size='large'
                />
            </div>
        </>
    );
}

export default Cars;
