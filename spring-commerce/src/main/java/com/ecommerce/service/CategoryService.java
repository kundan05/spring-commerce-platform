package com.ecommerce.service;

import com.ecommerce.dto.request.CategoryRequest;
import com.ecommerce.entity.Category;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    public Category createCategory(CategoryRequest categoryRequest) {
        Category category = modelMapper.map(categoryRequest, Category.class);
        if (categoryRequest.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryRequest.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Category", "id", categoryRequest.getParentId()));
            category.setParentCategory(parent);
        }
        return categoryRepository.save(category);
    }
}
