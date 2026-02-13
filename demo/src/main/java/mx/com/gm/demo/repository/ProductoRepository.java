package mx.com.gm.demo.repository;

import mx.com.gm.demo.dto.ResumenInventario;
import mx.com.gm.demo.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    //Buscar productos cuyo nombre contenga el texto (ignorando mayusculas) y los pagina
    Page<Producto> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    @Query("SELECT new mx.com.gm.demo.dto.ResumenInventario(" +
            "COUNT(p), " +
            "COALESCE(SUM(p.precio * p.stock), 0.0), " +
            "COALESCE(SUM(p.stock), 0L)) " +
            "FROM Producto p " +
            "WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :buscar, '%'))")
    ResumenInventario obtenerResumen(@Param("buscar") String buscar);
}
