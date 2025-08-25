package com.empresa.app.releases.application.port.in;

import com.empresa.app.releases.domain.model.ProductName;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.shared.domain.ReleaseStatus;

import java.util.List;

public interface ListReleasesUseCase {
    
    List<Release> listAll();
    
    List<Release> listByProductName(ProductName productName);
    
    List<Release> listByStatus(ReleaseStatus status);
    
    List<Release> listByProductNameAndStatus(ProductName productName, ReleaseStatus status);
}