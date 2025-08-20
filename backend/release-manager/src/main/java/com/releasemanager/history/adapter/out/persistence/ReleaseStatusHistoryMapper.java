package com.releasemanager.history.adapter.out.persistence;

import com.releasemanager.history.domain.model.ReleaseStatusHistory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "jakarta")
public interface ReleaseStatusHistoryMapper {

    ReleaseStatusHistoryMapper INSTANCE = Mappers.getMapper(ReleaseStatusHistoryMapper.class);

    ReleaseStatusHistory toDomain(ReleaseStatusHistoryJpaEntity entity);

    ReleaseStatusHistoryJpaEntity toEntity(ReleaseStatusHistory domain);
}
