import { Controller, Post, Body, Get, Query, Delete, Param, Put } from '@nestjs/common';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';
import { SaveCategoryForm } from 'src/model/forms/product-category/SaveCategoryForm';
import { UpdateCategoryForm } from 'src/model/forms/product-category/UpdateCategoryForm';

@Controller('backoffice/category')
export class CategoryController {

    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Post()
    saveOne(@Body() saveCategoryForm: SaveCategoryForm) {
        return this.productCategoryService.save(saveCategoryForm);
    }

    @Put()
    updateOne(@Body() updateCategoryForm: UpdateCategoryForm) {
        return this.productCategoryService.update(updateCategoryForm);
    }

    @Delete(':id')
    deleteOneCategory(@Param('id') categoryId: number) {
        return this.productCategoryService.deleteOneCategory(categoryId);
    }

    @Get()
    findOneWithFather(@Query('categoryId') categoryId: number) {
        return this.productCategoryService.findOneWithFather(categoryId);
    }

    @Get('all')
    findAllCategories(@Query('name') name: string) {
        return this.productCategoryService.findAllCategoriesFiltered(name);
    }

    @Get('tree')
    findCategoryTree(@Query('categoryId') categoryId: number) {
        return this.productCategoryService.findProductCategoryTree(categoryId);
    }

    @Get('tree/all')
    findCategoriesTree() {
        return this.productCategoryService.findAllCategoriesTree();
    }

}
