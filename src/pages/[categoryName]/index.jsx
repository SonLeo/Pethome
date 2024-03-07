import axios from 'axios';
import Footer from '~/views/layouts/footer/Footer';
import Header from '~/views/layouts/header/Header';
import Sidebar from '~/views/layouts/sidebar/Sidebar';
import { API_URLS } from '~/utils/commonUtils';
import ProductFilter from '~/components/productFilter/ProductFilter';
import Pagination from '~/components/pagination/Pagination';
import ProductList from '~/components/productList/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { selectSubcategories } from '~/rudux/actions/categoryActions';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { selectBrands } from '~/rudux/actions/brandActions';

const ITEMS_PER_PAGE = 40;

function CategoryPage({ initialSelectedSubcategories, category, products, categories, subcategories, currentPage, brands, initialSelectedBrands }) {
    const dispatch = useDispatch();
    const selectedSubcategories = useSelector(state => state.category.selectedSubcategories);
    const selectedBrands = useSelector(state => state.brand.selectedBrands);
    const router = useRouter();

    useEffect(() => {
        dispatch(selectSubcategories(initialSelectedSubcategories)),
            dispatch(selectBrands(initialSelectedBrands))
    }, [initialSelectedSubcategories, initialSelectedBrands])

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const updatedSelectedSubcategories = checked ?
            [...selectedSubcategories, value] :
            selectedSubcategories.filter(slug => slug !== value);

        dispatch(selectSubcategories(updatedSelectedSubcategories));

        router.push({
            pathname: router.pathname,
            query: { ...router.query, subcategories: updatedSelectedSubcategories.join(','), page: 1 }
        });
    }

    const handleBrandChange = (event) => {
        const { value, checked } = event.target;
        const updatedSelectedBrands = checked ?
            [...selectedBrands, value] :
            selectedBrands.filter(brandId => brandId !== Number(value));

        dispatch(selectBrands(updatedSelectedBrands));

        router.push({
            pathname: router.pathname,
            query: { ...router.query, brands: updatedSelectedBrands.join(','), page: 1 }
        })
    }

    const productsForSubcategoryChecked = products.filter(product =>
        !selectedSubcategories.length || selectedSubcategories.some(subcatId => product.subcategoryIds.includes(Number(subcatId)))
    );

    const uniqueBrandIdsSubcategory = Array.from(new Set(productsForSubcategoryChecked.map(product => product.brandId)));
    const brandsForSubcategory = brands.filter(brand => uniqueBrandIdsSubcategory.includes(brand.id));

    const filteredProducts = products.filter(product =>
        (!selectedSubcategories.length || selectedSubcategories.some(subcatId => product.subcategoryIds.includes(Number(subcatId)))) &&
        (!selectedBrands.length || selectedBrands.includes(product.brandId))
    );

    const productsToShow = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const subcategoriesQueryString = selectedSubcategories && selectedSubcategories.length > 0
        ? `&subcategories=${selectedSubcategories.join(',')}`
        : '';

    const brandsQueryString = selectedBrands && selectedBrands.length > 0
        ? `&brands=${selectedBrands.join(',')}`
        : '';

    return (
        <>
            <Header />
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar
                                categories={categories}
                                subcategories={subcategories}
                                category={category}
                                onCheckboxChange={handleCheckboxChange}
                                selectedSubcategories={selectedSubcategories}
                                brands={brandsForSubcategory}
                                onBrandChange={handleBrandChange}
                            />
                        </div>
                        <div className="col-md-9">
                            <ProductFilter
                                totalPages={totalPages}
                                category={category}
                                subcategory=''
                                currentPage={currentPage}
                                selectedSubcategories={selectedSubcategories}
                                selectedBrands={selectedBrands}
                                subcategoriesQueryString={subcategoriesQueryString}
                                brandsQueryString={brandsQueryString}
                            />
                            <ProductList products={productsToShow} />
                            <Pagination
                                totalPages={totalPages}
                                category={category}
                                subcategory=''
                                currentPage={currentPage}
                                selectedSubcategories={selectedSubcategories}
                                selectedBrands={selectedBrands}
                                subcategoriesQueryString={subcategoriesQueryString}
                                brandsQueryString={brandsQueryString}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export async function getServerSideProps(context) {
    const currentPage = context.query.page ? parseInt(context.query.page) : 1;
    const selectedSubcategoriesFromQuery = context.query.subcategories ? context.query.subcategories.split(',').map(slug => slug.trim()) : [];
    const selectedBrandsFromQuery = context.query.brands ? context.query.brands.split(',').map(Number) : [];

    try {
        const { data: allProducts } = await axios.get(API_URLS.PRODUCTS);
        const { data: allCategories } = await axios.get(API_URLS.CATEGORIES);
        const { data: allSubcategories } = await axios.get(API_URLS.SUBCATEGORIES);
        const { data: allBrands } = await axios.get(API_URLS.BRANDS);

        const category = allCategories.find(cat => cat.slug === context.params.categoryName);
        const subcategoriesForCategory = allSubcategories.filter(subcat => subcat.categoryIds.includes(category.id));
        const productsInCategory = allProducts.filter(product => product.categoryIds.includes(category.id));
        const uniqueBrandIdsCategory = Array.from(new Set(productsInCategory.map(product => product.brandId)));
        const brandsForCategory = allBrands.filter(brand => uniqueBrandIdsCategory.includes(brand.id));

        return {
            props: {
                category,
                products: productsInCategory,
                subcategories: subcategoriesForCategory,
                brands: brandsForCategory,
                currentPage: currentPage,
                categories: allCategories,
                initialSelectedSubcategories: selectedSubcategoriesFromQuery,
                initialSelectedBrands: selectedBrandsFromQuery
            }
        }

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        return { notFound: true };
    }
}

export default CategoryPage;
