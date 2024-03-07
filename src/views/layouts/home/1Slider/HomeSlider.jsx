import Link from 'next/link';
import styles from "./HomeSlider.module.css";
import { useEffect, useState } from 'react';
import { getBannerSlides } from '~/services/otherService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default function HomeSlider() {
    const [slides, setSlides] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const slidesData = await getBannerSlides();
                setSlides(slidesData);
            } catch (error) {
                console.error("Error fetching home slides:", error);
                throw error;
            }
        }
        fetchData();
    }, []);

    return (
        <section className="section">
            <div className={styles["section-slider"]}>
                <div className={styles["slide-container"]}>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    loop={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className={styles["banner-slider"]}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <Link href={slide.path}>
                                <img src={slide.image} alt={`Slide ${index}`} className={styles["slide"]} />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper >
                </div>
            </div>
        </section>
    )
}