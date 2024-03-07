import axios from 'axios';
import { useRouter } from 'next/router';
import { API_URLS, formatCurrency } from '~/utils/commonUtils';
import Footer from '~/views/layouts/footer/Footer';
import Header from '~/views/layouts/header/Header';
import styles from '~/styles/ProductSlug.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCartPlus, faChevronLeft, faChevronRight, faMinus, faPlus, faStar, faStarHalf, faTicket } from '@fortawesome/free-solid-svg-icons';
import Breadcumbs from '~/components/breadcumbs/Breadcumbs';
import { useEffect, useRef, useState } from 'react';
import ProductRating from '~/components/productRating/ProductRating';
import ProductOption from '~/components/productOption/ProductOption';
import { useDispatch } from 'react-redux';
import { buyNow } from '~/rudux/actions/buyNowActions';
import { addToCart } from '~/rudux/actions/cartActions';
import { useUser } from '~/components/userContext';
import { useToast } from '~/components/toastContext';

function ProductDetailPage({ product, categories, subcategories, variants }) {
  const { user } = useUser();
  const [activeImage, setActiveImage] = useState(product.imageDetails[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLastImageVisible, setIsLastImageVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [currentPrice, setCurrentPrice] = useState({
    price_old: product.price_old,
    price_new: product.price_new
  })
  const router = useRouter();
  const imageRef = useRef(null);
  const imageListRef = useRef(null);
  const dispatch = useDispatch();
  const { showSuccessToast, showErrorToast } = useToast();
  const imgItemWidth = 130;
  const shipping = 30000;
  const discount = 0;
  const subtotal = currentPrice.price_new * quantity;
  const totalAmount = subtotal - discount + shipping;
  const flavorOptions = getVariantOptions(variants, "Hương vị");
  const weightOptions = getVariantOptions(variants, "Trọng lượng");
  const sizeOptions = getVariantOptions(variants, "Size");

  const ratingsData = [
    { stars: 5, value: product.rating.details.five },
    { stars: 4, value: product.rating.details.four },
    { stars: 3, value: product.rating.details.three },
    { stars: 2, value: product.rating.details.two },
    { stars: 1, value: product.rating.details.one }
  ]

  useEffect(() => {
    if (imageListRef.current) {
      setIsLastImageVisible(scrollPosition + imageListRef.current.offsetWidth >= imageListRef.current.scrollWidth);
    }
  }, [scrollPosition, imageListRef])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(imageListRef.current.scrollLeft);
    }

    imageListRef.current.addEventListener('scroll', handleScroll);

    return () => {
      if (imageListRef.current) {
        imageListRef.current.removeEventListener('scroll', handleScroll);
      }
    }
  }, []);

  useEffect(() => {
    if (flavorOptions.length && weightOptions.length && sizeOptions.length) {
      setSelectedVariants({
        "Hương vị": flavorOptions[0],
        "Trọng lượng": weightOptions[0],
        "Size": sizeOptions[0]
      });
    }
  }, [flavorOptions, weightOptions, sizeOptions]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const generateBreadcrumbs = () => {
    const category = categories.find(cat => cat.id === product.categoryIds[0]);
    const subcategory = subcategories.find(sub => sub.id === product.subcategoryIds[0])

    if (!category || !subcategory) return [];

    return [
      { name: "Trang chủ", href: "/" },
      category && { name: category.name, href: "/" + category.slug },
      subcategory && { name: subcategory.name, href: "/" + category.slug + "/" + subcategory.slug },
      product && { name: product.productName, href: product.link }
    ]
  }

  const breadcumbs = generateBreadcrumbs();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1.5)';
      imageRef.current.style.transformOrigin = `${x}% ${y}%`;
    }
  }

  const handleMouseLeave = (e) => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1)';
      imageRef.current.style.transformOrigin = 'center center'
    }
  }

  const changeActiveImage = (index) => {
    setActiveImage(product.imageDetails[index]);
    setActiveIndex(index);
    const visibleItems = Math.floor(imageListRef.current.offsetWidth / imgItemWidth);
    const halfVisibleItems = Math.floor(visibleItems / 2);
    let scrollToIndex = index - halfVisibleItems;

    if (scrollToIndex < 0) {
      scrollToIndex = 0;
    }

    if (scrollToIndex > product.imageDetails.length - visibleItems) {
      scrollToIndex = product.imageDetails.length - visibleItems;
    }

    imageListRef.current.scrollTo({
      left: scrollToIndex * imgItemWidth,
      behavior: 'smooth'
    })
  }

  const handlePrevImage = () => {
    const moveBy = 2;
    const newPosition = imageListRef.current.scrollLeft - (imgItemWidth * moveBy);

    imageListRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }

  const handleNextImage = () => {
    const moveBy = 2;
    const newPosition = imageListRef.current.scrollLeft + (imgItemWidth * moveBy);

    imageListRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }

  function getVariantOptions(variants, type) {
    return variants.filter(variant => variant.type === type).map(variant => variant.value)
  }

  const handleVariantChange = (type, value) => {
    setSelectedVariants({
      ...selectedVariants,
      [type]: value
    });

    const correspondingVariant = variants.find(variant => variant.type === type && variant.value === value);

    if (correspondingVariant) {
      if (correspondingVariant.image) {
        const imageIndex = product.imageDetails.indexOf(correspondingVariant.image);

        setActiveIndex(imageIndex);
        setActiveImage(correspondingVariant.image);
      }

      if (correspondingVariant.price_old || correspondingVariant.price_new) {
        setCurrentPrice({
          price_old: correspondingVariant.price_old,
          price_new: correspondingVariant.price_new
        });
      }
    }
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  }

  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  }

  const handleInputQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  }

  const handleInputQuantityBlur = (e) => {
    if (e.target.value === '') {
      setQuantity(1);
    }
  }

  const handleBuyNow = () => {
    product.price_new = currentPrice.price_new;
    dispatch(buyNow(product, quantity, selectedVariants));
    router.push('/checkout');
  }

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({
        userId: user.id,
        productToAdd: {
          ...product,
          quantity,
          price_new: currentPrice.price_new,
          selectedVariants
        }
      }));
      showSuccessToast("Sản phẩm đã được thêm vào giỏ hàng");
    } else {
      showErrorToast("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng");
    }
  }

  return (
    <>
      <Header />
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Breadcumbs breadcumbs={breadcumbs} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-5">
                  <div className={styles["product-img"]}>
                    <div
                      className={styles["product-img__main"]}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img ref={imageRef} src={activeImage} alt={product.productName} />
                    </div>
                    <div className={styles["product-img__all"]}>
                      <ul
                        className={styles["img-list"]}
                        ref={imageListRef}
                      >
                        {
                          product && product.imageDetails && product.imageDetails.map((img, index) => (
                            <li
                              key={index}
                              className={`${styles["img-item"]} ${activeIndex === index ? styles["active"] : ""}`}
                              onClick={() => changeActiveImage(index)}
                            >
                              <img src={img} alt={product.productName} />
                            </li>
                          ))
                        }
                      </ul>
                      <button className={`${styles["prev-img"]} ${scrollPosition === 0 ? styles["disable"] : ""} ${(scrollPosition === 0 && isLastImageVisible) ? styles["hiden"] : ""}`} onClick={handlePrevImage}>
                        <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                      </button>
                      <button className={`${styles["next-img"]} ${isLastImageVisible ? styles["disable"] : ""} ${(scrollPosition === 0 && isLastImageVisible) ? styles["hiden"] : ""}`} onClick={handleNextImage}>
                        <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                      </button>
                    </div>
                  </div>
                  <div className={styles["product-rating-section"]}>
                    <h3 className={styles["rating-title"]}>Đánh giá sản phẩm</h3>
                    <div className={styles["rating-wraper"]}>
                      <div className={styles["rating-overview"]}>
                        <p className={styles["rating-score"]}>{parseFloat(product.rating.value).toFixed(1)}</p>
                        <ProductRating product={product} />
                        <p className={styles["rating-count"]}><span className={styles["count-number"]}>{product.rating.total}</span> đánh giá</p>
                      </div>
                      <div className={styles["rating-detail"]}>
                        {ratingsData.map(rating => {
                          const percentage = (rating.value / product.rating.total * 100).toFixed(0)
                          return (
                            <div key={rating.stars} className={styles["rating-detail-item"]} title={`${percentage}%`}>
                              <p>{rating.stars} <FontAwesomeIcon icon={faStar} /> ({percentage}%)</p>
                              <div className={styles["rating-bar"]}>
                                <div className={styles["bar"]} style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className={styles["product-tags"]}>
                    {product.tags.map((tag, index) => (
                      <div key={index} className={styles["tag-item"]}>{tag}</div>
                    ))}
                  </div>
                  <div className={styles["product-info"]}>
                    <h1 className={styles["product-name"]}>{product.productName}</h1>
                    <div className={styles["product-price"]}>
                      <div className={styles["product-price--old"]}>{currentPrice.price_old && formatCurrency(currentPrice.price_old)}</div>
                      <div className={styles["product-price--new"]}>{currentPrice.price_new && formatCurrency(currentPrice.price_new)}</div>
                    </div>
                    <div className={styles["product-metadata"]}>
                      <div className={styles["product-rate"]}>
                        <ProductRating product={product} />
                        <span className={styles["product-rate-info"]}>({parseFloat(product.rating.value).toFixed(1)})</span>
                      </div>
                      <div className={styles["seperate"]}></div>
                      <div className={styles["product-reviews"]}>
                        <span className={styles["product-review-amount"]}>{product.rating.total}</span> đánh giá
                      </div>
                      <div className={styles["seperate"]}></div>
                      <div className={styles["product-sold"]}>
                        <span className={styles["product-sold-amount"]}>{product.sold}</span> đã bán
                      </div>
                    </div>
                    {flavorOptions.length > 0 &&
                      <ProductOption
                        title="Chọn vị"
                        options={flavorOptions}
                        onOptionSelected={(selectedOption) => handleVariantChange("Hương vị", selectedOption)}
                      />
                    }
                    {weightOptions.length > 0 &&
                      <ProductOption
                        title="Trọng lượng"
                        options={weightOptions}
                        onOptionSelected={(selectedOption) => handleVariantChange("Trọng lượng", selectedOption)}
                      />
                    }
                    {sizeOptions.length > 0 &&
                      <ProductOption
                        title="Size"
                        options={sizeOptions}
                        onOptionSelected={(selectedOption) => handleVariantChange("Size", selectedOption)}
                      />
                    }
                  </div>
                  <div className={styles["product-description-section"]}>
                    <ul className={styles["description-tabs"]}>
                      <li
                        className={`${styles["description-tab-item"]} ${activeTab === 'description' ? styles["active"] : ""}`}
                        onClick={() => setActiveTab('description')}
                      >
                        Mô tả sản phẩm
                      </li>
                      <li
                        className={`${styles["description-tab-item"]} ${activeTab === 'instructions' ? styles["active"] : ""}`}
                        onClick={() => setActiveTab('instructions')}
                      >
                        Hướng dẫn sử dụng
                      </li>
                    </ul>
                    <div className={styles["description-content"]}>
                      {
                        activeTab === 'description' ? (
                          <div className={styles["description-content-item"]}>
                            <p>{product.description}</p>
                          </div>
                        ) : (
                          <div className={styles["description-content-item"]}>
                            <p>{product.instructions}</p>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className={styles["product-order"]}>
                <h3 className={styles["order-heading"]}>Giá trị đơn hàng</h3>
                <div className={styles["order-quantity"]}>
                  <p className={styles["quantity-label"]}>Số lượng:</p>
                  <p className={styles["quantity-controls"]}>
                    <button
                      className={styles["decrease-quantity"]}
                      onClick={handleDecreaseQuantity}
                      disabled={quantity < 2}
                    >
                      <FontAwesomeIcon className={styles["decrease-quantity-icon"]} icon={faMinus} />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      className={styles["quantity-input"]}
                      onChange={handleInputQuantityChange}
                      onBlur={handleInputQuantityBlur}
                    />
                    <button
                      className={styles["increase-quantity"]}
                      onClick={handleIncreaseQuantity}
                    >
                      <FontAwesomeIcon className={styles["increase-quantity-icon"]} icon={faPlus} />
                    </button>
                  </p>
                </div>
                {flavorOptions.length > 0 &&
                  <div className={styles["order-flavor"]}>
                    <p className={styles["order-flavor-title"]}>Hương vị:</p>
                    <p className={styles["order-flavor-value"]}>{selectedVariants["Hương vị"] || "Chưa chọn"}</p>
                  </div>
                }
                {weightOptions.length > 0 &&
                  <div className={styles["order-weight"]}>
                    <p className={styles["order-weight-title"]}>Trọng lượng:</p>
                    <p className={styles["order-weight-value"]}>{selectedVariants["Trọng lượng"] || "Chưa chọn"}</p>
                  </div>
                }

                {sizeOptions.length > 0 &&
                  <div className={styles["order-size"]}>
                    <p className={styles["order-size-title"]}>Size:</p>
                    <p className={styles["order-size-value"]}>{selectedVariants["Size"] || "Chưa chọn"}</p>
                  </div>
                }
                <div className={styles["order-price"]}>
                  <p className={styles["order-price-title"]}>Giá:</p>
                  <p className={styles["order-price-value"]}>{currentPrice.price_new && formatCurrency(currentPrice.price_new)}</p>
                </div>

                <div className={styles["order-coupon"]}>
                  <p className={styles["order-coupon-title"]}>Chọn mã giảm giá <FontAwesomeIcon icon={faTicket} /></p>
                  <p className={styles["order-coupon-icon"]}><FontAwesomeIcon icon={faAngleDown} /></p>
                </div>
                <div className={styles["order-subtotal"]}>
                  <p className={styles["order-subtotal-title"]}>Tạm tính:</p>
                  <p className={styles["order-subtotal-value"]}>{formatCurrency(subtotal)}</p>
                </div>
                <div className={styles["order-voucher"]}>
                  <p className={styles["order-voucher-title"]}>Giảm giá:</p>
                  <p className={styles["order-voucher-value"]}>{formatCurrency(discount)}</p>
                </div>
                <div className={styles["order-delevery"]}>
                  <p className={styles["order-delevery-title"]}>Phí vận chuyển:</p>
                  <p className={styles["order-delevery-value"]}>{formatCurrency(shipping)}</p>
                </div>
                <div className={styles["order-total"]}>
                  <p className={styles["order-total-title"]}>Tổng cộng:</p>
                  <p className={styles["order-total-value"]}>{formatCurrency(totalAmount)}</p>
                </div>
                <div className={styles["order-action-buttons"]}>
                  <button
                    className={styles["buy-now"]}
                    onClick={handleBuyNow}
                  >
                    Mua ngay
                  </button>
                  <button
                    className={styles["add-to-cart"]}
                    onClick={handleAddToCart}
                  ><FontAwesomeIcon icon={faCartPlus} /> Thêm vào giỏ</button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className={styles["best-seller"]}>
              <div className="col-md-12">

              </div>
            </div>
          </div>
          <div className="row">

          </div>
        </div >
      </div >
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const productSlug = context.params.productSlug;

  try {
    const { data: allProducts } = await axios.get(API_URLS.PRODUCTS);
    const { data: allCategories } = await axios.get(API_URLS.CATEGORIES);
    const { data: allSubcategories } = await axios.get(API_URLS.SUBCATEGORIES);
    const { data: allVariants } = await axios.get(API_URLS.VARIANTS);
    const product = allProducts.find(product => product.productSlug === productSlug);
    const variants = allVariants.filter(variant => variant.productId === product.id)
    return {
      props: {
        product,
        categories: allCategories,
        subcategories: allSubcategories,
        variants: variants
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return { notFound: true };
  }
}

export default ProductDetailPage;
