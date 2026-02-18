package com.ecommerce.controller;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAllProducts(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ProductResponse> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products fetched successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product fetched successfully", product));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> searchProducts(
            @RequestParam String query,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ProductResponse> products = productService.searchProducts(query, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products searched successfully", products));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestBody @Valid ProductRequest productRequest) {
        ProductResponse product = productService.createProduct(productRequest);
        return new ResponseEntity<>(new ApiResponse<>(true, "Product created successfully", product),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestBody @Valid ProductRequest productRequest) {
        // We'll need to implement this in service too if it doesn't exist, but let's
        // check Service first.
        // Assuming service has update method. If not, I'll add it.
        // Start by assuming it's available or I will add it.
        // Actually I should check ProductService first to be safe, but let's assume
        // standardCRUD.
        // Wait, looking at previous view_file of ProductService, it had create but not
        // update.
        // So I need to add update/delete to ProductService as well.
        // For now, I will add the controller methods and then update Service.
        ProductResponse product = productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", null));
    }
}
