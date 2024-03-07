import { Inter } from 'next/font/google'
import Header from '~/views/layouts/header/Header'
import HomeSlider from '~/views/layouts/home/1Slider/HomeSlider'
import BannerProduct from '~/views/layouts/home/2BannerProduct/BannerProduct'
import Deals from '~/views/layouts/home/3Deal/Deal'
import BannerService from '~/views/layouts/home/4BannerService/BannerService'
import CatFood from '~/views/layouts/home/5CatFood/CatFood'
import DogFood from '~/views/layouts/home/6DogFood/DogFood'
import BannerGrooming from '~/views/layouts/home/7BannerGrooming/BannerGrooming'
import PateForDog from '~/views/layouts/home/8PateForDog/PateForDog'
import PateForCat from '~/views/layouts/home/9PateForCat/PateForCat'
import Grooming from '~/views/layouts/home/10Grooming/Grooming'
import BeautyProducts from '~/views/layouts/home/11BeautyProducts/BeautyProducts'
import News from '~/views/layouts/home/12News/News'
import Footer from '~/views/layouts/footer/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
      <HomeSlider />
      <BannerProduct />
      <Deals />
      <BannerService />
      <CatFood />
      <DogFood />
      <BannerGrooming />
      <PateForDog />
      <PateForCat />
      <Grooming />
      <BeautyProducts />
      <News />
      <Footer />
    </>
  )
}
