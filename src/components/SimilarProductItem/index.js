// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productData} = props
  const {title, brand, imageUrl, rating, price} = productData

  return (
    <li className="product-item">
      <img src={imageUrl} alt="similar product" className="thumbnail" />
      <h1 className="title">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="product-details">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
