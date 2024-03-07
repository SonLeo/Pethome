import { useEffect, useState } from "react";
import styles from "./News.module.css"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from "swiper/modules";
import { getNews } from "~/services/otherService";

export default function News() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newsData = await getNews();
                setNews(newsData);
            } catch (error) {
                console.error("Error fetching news:", error);
                throw error;
            }
        }

        fetchData();
    }, []);

    return (
        <section className="section">
            <div className={styles["section-news"]}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className={styles["section-heading"]}>
                                <Link href="/blogs/news">
                                    <h2>Tin mới nhất</h2>
                                </Link>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className={styles["news-wrapper"]}>
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={10}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    navigation={true}
                                    modules={[Autoplay, Navigation]}
                                    className={styles["news-view-grid"]}
                                    breakpoints={{
                                        576: {
                                            slidesPerView: 2,
                                        },
                                        768: {
                                            slidesPerView: 3,
                                        },
                                        992: {
                                            slidesPerView: 4,
                                        },
                                        1200: {
                                            slidesPerView: 5,
                                        },
                                    }}
                                >
                                    {news.map(item => (
                                        <SwiperSlide key={item.id}>
                                            <div className={styles["new"]} title={item.title}>
                                                <Link href={`/news/${item.id}`}>
                                                    <img className={styles["new-thumbnail"]} src={item.thumbnailImage} alt={item.title} />
                                                    <div className={styles["new-desc"]}>
                                                        <h3 className={styles["new-title"]}>{item.title}</h3>
                                                        <p className={styles["new-date"]}>
                                                            <span className={styles["new-date-icon"]}>
                                                                <FontAwesomeIcon icon={faCalendarDays} />
                                                            </span>
                                                            {item.createDate}
                                                        </p>
                                                        <p className={styles["new-content"]}>{item.content}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}