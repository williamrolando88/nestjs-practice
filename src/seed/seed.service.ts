import { Injectable } from '@nestjs/common';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.populateProducts();

    return 'SEEDING COMPLETED';
  }

  private async populateProducts() {
    await this.productsService.clearProductsTable();
    const seedProducts = initialData.products satisfies CreateProductDto[];

    await Promise.all(
      seedProducts.map(async (product) => {
        await this.productsService.create(product);
      }),
    );

    // Logic to populate products
  }
}
