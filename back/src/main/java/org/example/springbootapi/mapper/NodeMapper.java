package org.example.springbootapi.mapper;


import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.entity.Node;

import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring")
@Component
public interface NodeMapper {

    @Mapping(source = "user.id", target = "userId")

    @Mapping(source = "parent.id", target = "parentId")

    @Mapping(target = "childrenIds", expression = "java(mapChildren(node))")

    NodeResponseDto toDto(Node node);

    List<NodeResponseDto> toDtoList(List<Node> nodes);

    default List<Long> mapChildren(Node node) {

        if (node.getChildren() == null) return List.of();

        return node.getChildren()

                .stream()

                .map(Node::getId)

                .toList();

    }

}
