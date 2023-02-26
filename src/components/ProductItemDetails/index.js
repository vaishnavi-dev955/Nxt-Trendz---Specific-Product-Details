import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    ProductIdObjectData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductsBasedOnId()
  }

  getProductsBasedOnId = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const ApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(ApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const UpdatedSimilarProductsData = data.similar_products.map(
        eachItem => ({
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          title: eachItem.title,
          style: eachItem.style,
          price: eachItem.price,
          description: eachItem.description,
          brand: eachItem.brand,
          totalReviews: eachItem.total_reviews,
          rating: eachItem.rating,
          availability: eachItem.availability,
        }),
      )
      const UpdatedProductIdData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        price: data.price,
        description: data.description,
      }
      console.log('UpdatedProductIdData', UpdatedProductIdData)
      console.log('UpdatedSimilarProductsData', UpdatedSimilarProductsData)
      this.setState({
        ProductIdObjectData: UpdatedProductIdData,
        similarProductsData: UpdatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickIncreaseButton = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onClickDecreaseButton = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-style"
      />
      <h1 className="Failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="shopping-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {ProductIdObjectData, similarProductsData, quantity} = this.state
    const {
      imageUrl,
      title,
      brand,
      price,
      rating,
      totalReviews,
      description,
      availability,
    } = ProductIdObjectData

    return (
      <>
        <div className="over-all-container">
          <img src={imageUrl} alt="product" className="image-style" />
          <div className="details-container">
            <h1 className="title1">{title}</h1>
            <p className="price-para">Rs {price}/- </p>
            <div className="rating-review-container">
              <div className="rating-box">
                <p className="rating-para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-logo"
                />
              </div>
              <p className="reviews-para">{totalReviews} Reviews</p>
            </div>
            <p className="description1">{description}</p>
            <p className="normal-para">Available: {availability}</p>
            <p className="normal-para">Brand: {brand}</p>
            <hr />
            <div className="counter-container">
              <button
                type="button"
                className="counter-button"
                onClick={this.onClickDecreaseButton}
                data-testid="minus"
              >
                <BsDashSquare className="button-icon" />
              </button>
              <p className="count-para">{quantity}</p>
              <button
                type="button"
                className="counter-button"
                onClick={this.onClickIncreaseButton}
                data-testid="plus"
              >
                <BsPlusSquare className="button-icon" />
              </button>
            </div>
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="product-heading1">Similar Products</h1>
          <ul className="product-list1">
            {similarProductsData.map(product => (
              <SimilarProductItem productData={product} key={product.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingViews = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingViews
      case apiStatusConstants.failure:
        return this.onFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderViews()}
      </>
    )
  }
}

export default ProductItemDetails
