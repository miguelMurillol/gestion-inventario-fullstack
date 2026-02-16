package mx.com.gm.demo.controller;

import jakarta.validation.Valid;
import mx.com.gm.demo.dto.ResumenInventario;
import mx.com.gm.demo.model.Producto;
import mx.com.gm.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173") //Permite que React se conecte
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    //Obtener todos los productos (GET)
    /*@GetMapping
    public List<Producto> listarTodos(){
        return productoRepository.findAll();
    }*/

    @GetMapping
    public Page<Producto> listarProductos(@RequestParam(defaultValue = "") String buscar, @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "nombre") String sort,
                                          @RequestParam(defaultValue = "asc") String direction){
        //Crear objeto oredenamiento
        Sort orden = direction. equalsIgnoreCase("desc") ? Sort.by(sort).descending() : Sort.by(sort).ascending();
        Pageable pageable = PageRequest.of(page, size, orden);
        if (buscar.isEmpty()){
            return productoRepository.findAll(pageable);
        }else{
            return productoRepository.findByNombreContainingIgnoreCase(buscar, pageable);
        }
    }

    //Guardar un nuevo prodocto (POST)
    @PostMapping
    /*public Producto guardar(@RequestBody Producto producto){
        return productoRepository.save(producto);
    }*/
    public ResponseEntity<?> guardar(@Valid @RequestBody Producto producto){
        //Si la validacion falla, srping boot lanara automaticamente un error 400 (Bad Request)
        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.ok(guardado);
    }

    //Actualizar un producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar (@PathVariable Integer id, @Valid @RequestBody Producto detallesProducto){
        return productoRepository.findById(id).map(producto -> {
            producto.setNombre((detallesProducto.getNombre()));
            producto.setPrecio((detallesProducto.getPrecio()));
            producto.setStock((detallesProducto.getStock()));

            Producto actualizado = productoRepository.save(producto);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    //Borrar un producto
    @DeleteMapping("/{id}")
    public void eliminar (@PathVariable Integer id){
        productoRepository.deleteById(id);
    }

    /*@GetMapping("/totales")
    public ResponseEntity<ResumenInventario> obtenerTotales(@RequestParam(defaultValue = "") String buscar){
        return ResponseEntity.ok(productoRepository.obtenerResumen(buscar));
    }*/

    @GetMapping("/totales")
    public ResponseEntity<ResumenInventario> obtenerTotales(
            @RequestParam(defaultValue = "") String buscar
    ) {
        return ResponseEntity.ok(productoRepository.obtenerResumen(buscar));
    }
}
