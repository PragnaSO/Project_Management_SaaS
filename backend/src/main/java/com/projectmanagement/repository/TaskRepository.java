package com.projectmanagement.repository;

import com.projectmanagement.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("select t from Task t left join fetch t.assignedTo join fetch t.project where t.project.id = :projectId order by t.createdAt desc")
    List<Task> findByProjectIdWithAssignee(@Param("projectId") Long projectId);
}
