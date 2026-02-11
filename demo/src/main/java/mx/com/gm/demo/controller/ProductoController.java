package mx.com.gm.demo.controller;

import jakarta.validation.Valid;
import mx.com.gm.demo.model.Producto;
import mx.com.gm.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    @GetMapping
    public List<Producto> listarTodos(){
        return productoRepository.findAll();
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

    //Borrar un producto
    @DeleteMapping("/{id}")
    public void eliminar (@PathVariable Integer id){
        System.out.println("Llega aquí");
        productoRepository.deleteById(id);
    }
}
