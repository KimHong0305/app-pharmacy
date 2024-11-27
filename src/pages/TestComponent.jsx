import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../store/Reducers/productReducer';
import React, { useEffect } from 'react';

const TestComponent = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Quantity: {product.quantity}</p>
          <p>Benefits: {product.benefits}</p>
          <p>Ingredients: {product.ingredients}</p>
          <p>Contraindication: {product.constraindication}</p>
          <p>Object use: {product.object_use}</p>
          <p>Instruction: {product.instruction}</p>
          <p>Preserve: {product.preserve}</p>
          <p>Doctor advice: {product.doctor_advice ? 'Yes' : 'No'}</p>
          <p>Date creation: {product.dateCreation}</p>
          <p>Date expiration: {product.dateExpiration}</p>
          <p>Company: {product.company.name}</p>
          <p>Category: {product.category.name}</p>
          <img src={product.image} alt={product.name} />
        </div>
      ))}
    </div>
  );
}

export default TestComponent;