import Link from "next/link";
import { useEffect } from "react";
import styles from "./Footer.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faGooglePlusG, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const backToTopBtn = document.querySelector(`.${styles['back-to-top']}`);

            if (scrollTop > 132) {
                backToTopBtn.classList.add(styles.show);
            } else {
                backToTopBtn.classList.remove(styles.show);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles['footer-social']}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className={styles.socials}>
                                <li className={styles.social} title="Facebook">
                                    <Link target="_blank" href='https://www.facebook.com/petshomevn'>
                                        <FontAwesomeIcon className={styles['social-icon']} icon={faFacebookF} />
                                    </Link>
                                </li>
                                <li className={styles.social} title="Twitter">
                                    <Link target="_blank" href='#'>
                                        <FontAwesomeIcon className={styles['social-icon']} icon={faTwitter} />
                                    </Link>
                                </li>
                                <li className={styles.social} title="Google plus">
                                    <Link target="_blank" href='https://www.google.com/search?q=pet%27s%20home&amp;hl=vi&amp;sxsrf=APq-WBvOO3aAqA97lpqqjmpB4ID6Y7Cd0Q:1645269791987&amp;source=hp&amp;ei=HNMQYrabCe6P4-EP59yqiAE&amp;iflsig=AHkkrS4AAAAAYhDhLIzLsHAFqjHrh-GKHHX6b_27J40R&amp;oq=pe&amp;gs_lcp=Cgdnd3Mtd2l6EAMYADIECCMQJzIECCMQJzIECCMQJzIECAAQQzIKCC4QxwEQrwEQQzIKCC4QxwEQowIQQzILCC4QgAQQxwEQrwEyDgguEIAEELEDEIMBENQCMgsILhCABBCxAxCDATIICAAQgAQQsQM6CwgAEIAEELEDEIMBOgUIABCABDoRCC4QgAQQsQMQgwEQxwEQrwE6BQgAELEDOgoIABCxAxCDARBDUABYvQpg_Q9oBHAAeACAAXqIAbgDkgEDMC40mAEAoAEB&amp;sclient=gws-wiz&amp;tbs=lf:1,lf_ui:10&amp;tbm=lcl&amp;rflfq=1&amp;num=10&amp;rldimm=6205995750958197738&amp;lqi=CgpwZXQncyBob21lWgwiCnBldCdzIGhvbWWSARBwZXRfc3VwcGx5X3N0b3Jl&amp;phdesc=HndjfkR2vMA&amp;ved=2ahUKEwjk-YrM04v2AhXhzTgGHV1qC_EQvS56BAgZEGA&amp;rlst=f#rlfi=hd:;si:6205995750958197738,l,CgpwZXQncyBob21lWgwiCnBldCdzIGhvbWWSARBwZXRfc3VwcGx5X3N0b3Jl,y,HndjfkR2vMA;mv:[[10.8380925,106.6925024],[10.7799297,106.6649238]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u2!2m2!2m1!1e1!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:10'>
                                        <FontAwesomeIcon className={styles['social-icon']} icon={faGooglePlusG} />
                                    </Link>
                                </li>
                                <li className={styles.social} title="Instagram">
                                    <Link target="_blank" href='https://www.instagram.com/ngoinha.thucung/'>
                                        <FontAwesomeIcon className={styles['social-icon']} icon={faInstagram} />
                                    </Link>
                                </li>
                                <li className={styles.social} title="Youtube">
                                    <Link target="_blank" href='https://www.youtube.com/channel/UCAlYhZoOECCHr2xd3M8k2iQ'>
                                        <FontAwesomeIcon className={styles['social-icon']} icon={faYoutube} />
                                    </Link>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['footer-main']}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className={styles['footer-contact']}>
                                <h3 className={styles['footer-heading']}>Liên hệ</h3>
                                <ul>
                                    <li>
                                        <span className={styles['footer-sub-heading']}>Địa chỉ:</span> 156 Hoa Lan, Phường 2, Phú Nhuận
                                    </li>
                                    <li>
                                        <span className={styles['footer-sub-heading']}>Điện thoại:</span> <Link href='tel:0866211334'>0866211334</Link>
                                    </li>
                                    <li>
                                        <span className={styles['footer-sub-heading']}>Email:</span> <Link href='mailto:petshome@gmail.com'>petshome@gmail.com</Link>
                                    </li>
                                    <li>
                                        <span className={styles['footer-sub-heading']}>Website:</span> <Link href='https://www.petshome.vn'>https://www.petshome.vn</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className={styles['footer-about']}>
                                <h3 className={styles['footer-heading']}>Vể pet's home</h3>
                                <p>Hệ thống cửa hàng chuyên cung cấp các mặt hàng và dịch vụ chăm sóc thú cưng. Với tiêu chí uy tín và chất lượng tốt nhất cho các bạn thú cưng, ở Pet's Home khách hàng sẽ hài lòng về hàng hóa đa dạng và phong phú, giá cả cực kỳ phải chăng và nhân viên chăm sóc nhiệt tình, chu đáo.</p>
                            </div>
                        </div>
                        <div className="col-lg-1">
                            <div className={styles['footer-category']}>
                                <h3 className={styles['footer-heading']}>Danh mục</h3>
                                <ul>
                                    <li><Link href="/" title="Trang chủ">Trang chủ</Link></li>
                                    <li><Link href="/collections/san-pham-khuyen-mai" title="Khuyến mãi">Khuyến mãi</Link></li>
                                    <li><Link href="/blogs/spa-grooming" title="Dịch vụ">Dịch vụ</Link></li>
                                    <li><Link href="/blogs/news" title="Tin tức">Tin tức</Link></li>
                                    <li><Link href="/pages/lien-he" title="Liên hệ">Liên hệ</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className={styles['footer-policy-payment']}>
                                <div className={styles['footer-policy']}>
                                    <h3 className={styles['footer-heading']}>Chính sách</h3>
                                    <ul className="list-menu">
                                        <li><Link href="/pages/chinh-sach-doi-tra-hang-va-hoan-tien" title="Chính sách đổi/trả hàng và hoàn tiền">Chính sách đổi/trả</Link></li>
                                        <li><Link href="/pages/chinh-sach-van-chuyen-giao-nhan" title="Chính sách vận chuyển, giao nhận">Chính sách vận chuyển</Link></li>
                                        <li><Link href="/pages/bao-mat-thong-tin-khach-hang" title="Bảo mật thông tin khách hàng">Bảo mật thông tin</Link></li>
                                        <li><Link href="/pages/hinh-thuc-thanh-toan" title="Hình thức thanh toán">Hình thức thanh toán</Link></li>
                                    </ul>
                                </div>

                                <div className={styles['footer-payment']}>
                                    <div className={styles['footer-registered-business']}>
                                        <Link href="http://online.gov.vn/Home/WebDetails/26597">
                                            <img src="//theme.hstatic.net/1000104513/1000839384/14/fot_chung_nhan.png?v=94" className="img-responsive" alt="link" />
                                        </Link>
                                    </div>
                                    <div className={styles['footer-payment-method']}>
                                        <Link href="/pages/hinh-thuc-thanh-toan" title="Hình thức thanh toán">
                                            <img src="//theme.hstatic.net/1000104513/1000839384/14/fot_chung_nhan2.png?v=94" className="img-responsive" alt="footer image" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['footer-copyright']}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <span>© Bản quyền thuộc về Pet's Home</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['back-to-top']} onClick={handleBackToTop}>
                <div className={styles['back-to-top-icon']}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </div>
            </div>
        </footer>
    )
}

export default Footer;