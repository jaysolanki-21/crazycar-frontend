// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';

// const UpdateCar = () => {
//     const { id } = useParams(); // Get car ID from URL
//     const navigate = useNavigate();
//     const { register, handleSubmit, reset, formState: { errors } } = useForm();

//     const [priceUnit, setPriceUnit] = useState('Lakhs');

//     // Fetch car data by ID
//     useEffect(() => {
//         const fetchCarData = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5000/getcardata/${id}`);
//                 const data = await response.json();

//                 if (response.ok) {
//                     const priceNumber = parseFloat(data.price);
//                     const unit = data.price.includes('Lakhs') ? 'Lakhs' : 'Crores';

//                     reset({
//                         model: data.model,
//                         brand: data.brand,
//                         price: priceNumber,
//                         year: data.year,
//                         fuelType: data.fuelType,
//                         mileage: data.mileage,
//                         transmission: data.transmission,
//                         engineCapacity: data.engineCapacity,
//                         seatingCapacity: data.seatingCapacity,
//                         bodyType: data.bodyType,
//                         safetyFeatures: data.safetyFeatures.join(', '),
//                         bootSpace: data.bootSpace,
//                         features: data.features.join(', '),
//                         warranty: data.warranty,
//                         description: data.description,
//                     });
//                     setPriceUnit(unit);
//                 } else {
//                     console.error('Error fetching car data:', data.message);
//                     alert('Car not found!');
//                     navigate('/dashboard'); // Redirect if car not found
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         };

//         fetchCarData();
//     }, [id, reset, navigate]);

//     const onSubmit = async (formData) => {
//         const updatedCarData = new FormData();

//         Object.keys(formData).forEach((key) => {
//             if (key === 'image' && formData.image.length > 0) {
//                 Array.from(formData.image).forEach((file) => {
//                     updatedCarData.append('image', file);
//                 });
//             } else {
//                 updatedCarData.append(key, formData[key]);
//             }
//         });

//         try {
//             const response = await fetch(`http://localhost:5000/updatecar/${id}`, {
//                 method: 'PUT',
//                 body: updatedCarData,
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert('Car updated successfully!');
//                 navigate(`/carinfo/${id}`);
//             } else {
//                 console.error('Error updating car:', result.message);
//                 alert(`Error: ${result.message}`);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('An unexpected error occurred. Please try again.');
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h1 style={styles.title}>Update Car</h1>
//             <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
//             <div style={styles.formLeft}>
//              <label style={styles.label}>Model:
//                         <input
//                             type="text"
//                             {...register('model', { required: 'Model is required' })}
//                             className='inputFeild'
//                             disabled
//                             onBlur={(e) => checkModelAvailability(e.target.value)}
//                         />
//                         {/* {modelExists && <span style={styles.error}>Model already exists</span>} */}
//                         {errors.model && <span style={styles.error}>{errors.model.message}</span>}
//                     </label>

//                     <label style={styles.label}>Brand:
//                         <input
//                             type="text"
//                             {...register('brand', { required: 'Brand is required' })}
//                             className='inputFeild'
//                             disabled
//                         />
//                         {errors.brand && <span style={styles.error}>{errors.brand.message}</span>}
//                     </label>

//                     <label style={styles.label}>Price:
//                         <input
//                             type="number"
//                             step="0.01"
//                             {...register('price', {
//                                 required: 'Price is required',
//                                 valueAsNumber: true,
//                                 min: { value: 3.00, message: 'Price must be a positive number' }
//                             })}
//                             className='inputFeild'
//                             min={3}
//                         />
//                         <select
//                             value={priceUnit}
//                             onChange={(e) => setPriceUnit(e.target.value)}
//                             // style={styles.select}
//                             className='inputFeild'
//                         >
//                             <option value="Lakhs">Lakhs</option>
//                             <option value="Crores">Crores</option>
//                         </select>
//                         {errors.price && <span style={styles.error}>{errors.price.message}</span>}
//                     </label>

//                     <label style={styles.label}>Year:
//                         <input
//                             type="number"
//                             className='inputFeild'
//                             {...register('year', {
//                                 required: 'Year is required',
//                                 valueAsNumber: true,
//                                 min: { value: 1900, message: 'Year must be greater than 1900' },
//                                 max: { value: new Date().getFullYear(), message: `Year cannot be beyond ${new Date().getFullYear()}` }
//                             })}
//                             min={1900}
//                         />
//                         {errors.year && <span style={styles.error}>{errors.year.message}</span>}
//                     </label>

//                     <label style={styles.label}>Fuel Type:
//                         <input
//                             type="radio"
//                             value="Electric"
//                             {...register('fuelType', { required: 'Fuel type is required' })}
//                         /> Electric
//                         <input
//                             type="radio"
//                             value="Petrol"
//                             style={{ marginBottom: "20px" }}
//                             {...register('fuelType', { required: 'Fuel type is required' })}
//                         /> Petrol
//                         <input
//                             type="radio"
//                             value="Diesel"
//                             {...register('fuelType', { required: 'Fuel type is required' })}
//                         /> Diesel
//                         {errors.fuelType && <span style={styles.error}>{errors.fuelType.message}</span>}
//                     </label>
//                     <label style={styles.label}>Mileage:
//                         <input
//                             type="text"
//                             {...register('mileage', { required: 'Mileage is required' })}
//                             className='inputFeild'
//                         />
//                         {errors.mileage && <span style={styles.error}>{errors.mileage.message}</span>}
//                     </label>
//                     <label style={styles.label}>Transmission:
//                         <input
//                             type="radio"
//                             value="Automatic"
//                             style={{ marginBottom: "20px" }}
//                             {...register('transmission', { required: 'Transmission is required' })}
//                         /> Automatic
//                         <input
//                             type="radio"
//                             value="Manual"
//                             {...register('transmission', { required: 'Transmission is required' })}
//                         /> Manual
//                         {errors.transmission && <span style={styles.error}>{errors.transmission.message}</span>}
//                     </label>
//                     <label style={styles.label}>Engine Capacity (cc):
//                         <input
//                             type="text"
//                             {...register('engineCapacity', {
//                                 required: 'Engine capacity is required',
//                             })}
//                             className='inputFeild'
//                         />
//                         {errors.engineCapacity && <span style={styles.error}>{errors.engineCapacity.message}</span>}
//                     </label>
//                 </div>

//                 <div style={styles.formRight}>
//                     <label style={styles.label}>Seating Capacity:
//                         <input
//                             type="number"
//                             {...register('seatingCapacity', {
//                                 required: 'Seating capacity is required',
//                                 valueAsNumber: true,
//                                 min: { value: 1, message: 'Seating capacity must be at least 1' }
//                             })}
//                             className='inputFeild'
//                         />
//                         {errors.seatingCapacity && <span style={styles.error}>{errors.seatingCapacity.message}</span>}
//                     </label>

//                     <label style={styles.label}>Body Type:
//                         <input
//                             type="text"
//                             {...register('bodyType', { required: 'Body type is required' })}
//                             className='inputFeild'
//                         />
//                         {errors.bodyType && <span style={styles.error}>{errors.bodyType.message}</span>}
//                     </label>

//                     <label style={styles.label}>Boot Space (liters):
//                         <input
//                             type="number"
//                             {...register('bootSpace', {
//                                 required: 'Boot space is required',
//                                 valueAsNumber: true,
//                                 min: { value: 1, message: 'Boot space must be a positive number' }
//                             })}
//                             // style={styles.input}
//                             className='inputFeild'
//                         />
//                         {errors.bootSpace && <span style={styles.error}>{errors.bootSpace.message}</span>}
//                     </label>

//                     <label style={styles.label}>Safety Features:
//                         <input
//                             type="text"
//                             {...register('safetyFeatures', { required: 'Safety features are required' })}
//                             // style={styles.input}
//                             className='inputFeild'
//                         />
//                         {errors.safetyFeatures && <span style={styles.error}>{errors.safetyFeatures.message}</span>}
//                     </label>

//                     <label style={styles.label}>Features:
//                         <input
//                             type="text"
//                             {...register('features', { required: 'Features are required' })}
//                             // style={styles.input}
//                             className='inputFeild'
//                         />
//                         {errors.features && <span style={styles.error}>{errors.features.message}</span>}
//                     </label>

//                     <label style={styles.label}>Warranty:
//                         <input
//                             type="text"
//                             {...register('warranty', { required: 'Warranty is required' })}
//                             // style={styles.input}
//                             className='inputFeild'
//                         />
//                         {errors.warranty && <span style={styles.error}>{errors.warranty.message}</span>}
//                     </label>

//                     <label style={styles.label}>Description:
//                         <textarea
//                             {...register('description', { required: 'Description is required' })}
//                             // style={styles.textarea}
//                             className='inputFeild'
//                         />
//                         {errors.description && <span style={styles.error}>{errors.description.message}</span>}
//                     </label>

//                     <label style={styles.label}>Upload Image(s):
//                         <input
//                             type="file"
//                             accept="image/*"
//                             {...register('image',{required: 'image is required'})}
//                             className="inputField"
//                             multiple
//                         />
//                          {errors.image && <span style={styles.error}>{errors.image.message}</span>}
//                     </label>

//                     <button type="submit" className="submitButton">Update Car</button>
//                 </div>
//             </form>
//         </div>
//     );
// };








// // CSS-in-JS styles
// const styles = {
//     container: {
//         maxWidth: '1200px',
//         margin: '0 auto',
//         padding: '20px',
//         fontFamily: 'Arial, sans-serif',
//     },
//     title: {
//         textAlign: 'center',
//         marginBottom: '40px',
//         fontSize: '2rem',
//         color: '#333',
//     },
//     form: {
//         display: 'flex',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     formLeft: {
//         width: '48%',
//     },
//     formRight: {
//         width: '48%',
//     },
//     label: {
//         display: 'block',
//         marginBottom: '10px',
//         fontWeight: 'bold',
//         color: '#444',
//     },
//     input: {
//         width: '100%',
//         padding: '10px',
//         border: '1px solid #ddd',
//         borderRadius: '5px',
//         marginBottom: '15px',
//     },
//     select: {
//         width: '100%',
//         padding: '10px',
//         border: '1px solid #ddd',
//         borderRadius: '5px',
//         marginBottom: '15px',
//     },
//     textarea: {
//         width: '100%',
//         padding: '10px',
//         border: '1px solid #ddd',
//         borderRadius: '5px',
//         height: '100px',
//         marginBottom: '15px',
//     },
//     submitButton: {
//         display: 'block',
//         width: '150px',
//         padding: '10px',
//         border: 'none',
//         backgroundColor: '#007BFF',
//         color: 'white',
//         fontSize: '1.1rem',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         marginTop: '30px',
//     },
//     error: {
//         color: 'red',
//         fontSize: '0.9rem',
//         marginTop: '-10px',
//         marginBottom: '10px',
//     }
// };

// export default UpdateCar;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const UpdateCar = () => {
    const { id } = useParams(); // Get car ID from URL
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [priceUnit, setPriceUnit] = useState('Lakhs');

    // Fetch car data by ID
    useEffect(() => {
        const fetchCarData = async () => {
            try {
                // const response = await fetch(`http://localhost:5000/getcardata/${id}`);
                const response = await fetch(`https://crazycar-kxb4.onrender.com/getcardata/${id}`);

            
                const data = await response.json();

                if (response.ok) {
                    const priceNumber = parseFloat(data.price);
                    const unit = data.price.includes('Lakhs') ? 'Lakhs' : 'Crores';

                    reset({
                        model: data.model,
                        brand: data.brand,
                        price: priceNumber,
                        year: data.year,
                        fuelType: data.fuelType,
                        mileage: data.mileage,
                        transmission: data.transmission,
                        engineCapacity: data.engineCapacity,
                        seatingCapacity: data.seatingCapacity,
                        bodyType: data.bodyType,
                        safetyFeatures: data.safetyFeatures.join(', '),
                        bootSpace: data.bootSpace,
                        features: data.features.join(', '),
                        warranty: data.warranty,
                        description: data.description,
                    });
                    setPriceUnit(unit);
                } else {
                    console.error('Error fetching car data:', data.message);
                    alert('Car not found!');
                    navigate('/dashboard'); // Redirect if car not found
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCarData();
    }, [id, reset, navigate]);

    const onSubmit = async (formData) => {
        const updatedCarData = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === 'image' && formData.image.length > 0) {
                Array.from(formData.image).forEach((file) => {
                    updatedCarData.append('image', file);
                });
            } else {
                updatedCarData.append(key, formData[key]);
            }
        });

        // Include the price unit explicitly
        updatedCarData.append('priceUnit', priceUnit);

        try {
            // const response = await fetch(`http://localhost:5000/updatecar/${id}`, {
                const response = await fetch(`https://crazycar-kxb4.onrender.com/updatecar/${id}`, {
                method: 'PUT',
                body: updatedCarData,
            });

            const result = await response.json();

            if (response.ok) {
                alert('Car updated successfully!');
                navigate(`/carinfo/${id}`);
            } else {
                console.error('Error updating car:', result.message);
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Update Car</h1>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                <div style={styles.formLeft}>
                    <label style={styles.label}>Model:
                        <input
                            type="text"
                            {...register('model', { required: 'Model is required' })}
                            className='inputFeild'
                            disabled
                        />
                        {errors.model && <span style={styles.error}>{errors.model.message}</span>}
                    </label>

                    <label style={styles.label}>Brand:
                        <input
                            type="text"
                            {...register('brand', { required: 'Brand is required' })}
                            className='inputFeild'
                            disabled
                        />
                        {errors.brand && <span style={styles.error}>{errors.brand.message}</span>}
                    </label>

                    <label style={styles.label}>Price:
                        <input
                            type="number"
                            step="0.01"
                            {...register('price', {
                                required: 'Price is required',
                                valueAsNumber: true,
                                min: { value: 3.00, message: 'Price must be a positive number' }
                            })}
                            className='inputFeild'
                            min={3}
                        />
                        <select
                            value={priceUnit}
                            onChange={(e) => setPriceUnit(e.target.value)}
                            className='inputFeild'
                        >
                            <option value="Lakhs">Lakhs</option>
                            <option value="Crores">Crores</option>
                        </select>
                        {errors.price && <span style={styles.error}>{errors.price.message}</span>}
                    </label>

                    <label style={styles.label}>Year:
                        <input
                            type="number"
                            className='inputFeild'
                            {...register('year', {
                                required: 'Year is required',
                                valueAsNumber: true,
                                min: { value: 1900, message: 'Year must be greater than 1900' },
                                max: { value: new Date().getFullYear(), message: `Year cannot be beyond ${new Date().getFullYear()}` }
                            })}
                            min={1900}
                        />
                        {errors.year && <span style={styles.error}>{errors.year.message}</span>}
                    </label>

                    <label style={styles.label}>Fuel Type:
                        <input
                            type="radio"
                            value="Electric"
                            {...register('fuelType', { required: 'Fuel type is required' })}
                        /> Electric
                        <input
                            type="radio"
                            value="Petrol"
                            style={{ marginBottom: "20px" }}
                            {...register('fuelType', { required: 'Fuel type is required' })}
                        /> Petrol
                        <input
                            type="radio"
                            value="Diesel"
                            {...register('fuelType', { required: 'Fuel type is required' })}
                        /> Diesel
                        {errors.fuelType && <span style={styles.error}>{errors.fuelType.message}</span>}
                    </label>
                    <label style={styles.label}>Mileage:
                        <input
                            type="text"
                            {...register('mileage', { required: 'Mileage is required' })}
                            className='inputFeild'
                        />
                        {errors.mileage && <span style={styles.error}>{errors.mileage.message}</span>}
                    </label>
                    <label style={styles.label}>Transmission:
                        <input
                            type="radio"
                            value="Automatic"
                            style={{ marginBottom: "20px" }}
                            {...register('transmission', { required: 'Transmission is required' })}
                        /> Automatic
                        <input
                            type="radio"
                            value="Manual"
                            {...register('transmission', { required: 'Transmission is required' })}
                        /> Manual
                        {errors.transmission && <span style={styles.error}>{errors.transmission.message}</span>}
                    </label>
                    <label style={styles.label}>Engine Capacity (cc):
                        <input
                            type="text"
                            {...register('engineCapacity', {
                                required: 'Engine capacity is required',
                            })}
                            className='inputFeild'
                        />
                        {errors.engineCapacity && <span style={styles.error}>{errors.engineCapacity.message}</span>}
                    </label>
                </div>

                <div style={styles.formRight}>
                    <label style={styles.label}>Seating Capacity:
                        <input
                            type="number"
                            {...register('seatingCapacity', {
                                required: 'Seating capacity is required',
                                valueAsNumber: true,
                                min: { value: 1, message: 'Seating capacity must be at least 1' }
                            })}
                            className='inputFeild'
                        />
                        {errors.seatingCapacity && <span style={styles.error}>{errors.seatingCapacity.message}</span>}
                    </label>

                    <label style={styles.label}>Body Type:
                        <input
                            type="text"
                            {...register('bodyType', { required: 'Body type is required' })}
                            className='inputFeild'
                        />
                        {errors.bodyType && <span style={styles.error}>{errors.bodyType.message}</span>}
                    </label>

                    <label style={styles.label}>Boot Space (liters):
                        <input
                            type="number"
                            {...register('bootSpace', {
                                required: 'Boot space is required',
                                valueAsNumber: true,
                                min: { value: 1, message: 'Boot space must be a positive number' }
                            })}
                            // style={styles.input}
                            className='inputFeild'
                        />
                        {errors.bootSpace && <span style={styles.error}>{errors.bootSpace.message}</span>}
                    </label>

                    <label style={styles.label}>Safety Features:
                        <input
                            type="text"
                            {...register('safetyFeatures', { required: 'Safety features are required' })}
                            // style={styles.input}
                            className='inputFeild'
                        />
                        {errors.safetyFeatures && <span style={styles.error}>{errors.safetyFeatures.message}</span>}
                    </label>

                    <label style={styles.label}>Features:
                        <input
                            type="text"
                            {...register('features', { required: 'Features are required' })}
                            // style={styles.input}
                            className='inputFeild'
                        />
                        {errors.features && <span style={styles.error}>{errors.features.message}</span>}
                    </label>

                    <label style={styles.label}>Warranty:
                        <input
                            type="text"
                            {...register('warranty', { required: 'Warranty is required' })}
                            // style={styles.input}
                            className='inputFeild'
                        />
                        {errors.warranty && <span style={styles.error}>{errors.warranty.message}</span>}
                    </label>

                    <label style={styles.label}>Description:
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            // style={styles.textarea}
                            className='inputFeild'
                        />
                        {errors.description && <span style={styles.error}>{errors.description.message}</span>}
                    </label>

                    <label style={styles.label}>Upload Image(s):
                        <input
                            type="file"
                            accept="image/*"
                            {...register('image',{required: 'image is required'})}
                            className="inputField"
                            multiple
                        />
                         {errors.image && <span style={styles.error}>{errors.image.message}</span>}
                    </label>

                    <button type="submit" className="submitButton">Update Car</button>
                </div>
            </form>
        </div>
    );
};








// CSS-in-JS styles
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        marginBottom: '40px',
        fontSize: '2rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    formLeft: {
        width: '48%',
    },
    formRight: {
        width: '48%',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontWeight: 'bold',
        color: '#444',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginBottom: '15px',
    },
    select: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginBottom: '15px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        height: '100px',
        marginBottom: '15px',
    },
    submitButton: {
        display: 'block',
        width: '150px',
        padding: '10px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        fontSize: '1.1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '30px',
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginTop: '-10px',
        marginBottom: '10px',
    }
};

export default UpdateCar;