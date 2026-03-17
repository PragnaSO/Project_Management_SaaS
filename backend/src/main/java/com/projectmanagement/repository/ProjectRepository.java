package com.projectmanagement.repository;

import com.projectmanagement.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("select distinct p from Project p left join fetch p.tasks t left join fetch t.assignedTo left join fetch p.createdBy order by p.createdAt desc")
    List<Project> findAllWithTasks();

    @Query("select distinct p from Project p left join fetch p.tasks t left join fetch t.assignedTo left join fetch p.createdBy where t.assignedTo.id = :userId order by p.createdAt desc")
    List<Project> findAssignedProjects(@Param("userId") Long userId);
}
