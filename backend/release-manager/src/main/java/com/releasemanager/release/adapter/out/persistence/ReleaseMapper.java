package com.releasemanager.release.adapter.out.persistence;

import com.releasemanager.release.domain.model.Release;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "jakarta")
public interface ReleaseMapper {

    ReleaseMapper INSTANCE = Mappers.getMapper(ReleaseMapper.class);

    Release toDomain(ReleaseJpaEntity entity);

    ReleaseJpaEntity toEntity(Release domain);

    void updateEntityFromDomain(Release domain, @MappingTarget ReleaseJpaEntity entity);
}
