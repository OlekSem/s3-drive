package org.example.springbootapi.mapper;


import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.entity.Node;

import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring")
@Component
public interface NodeMapper {

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "parent.id", target = "parentId")

    NodeResponseDto toDto(Node node);
    List<NodeResponseDto> toDtoList(List<Node> nodes);

}
