import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Badge } from "flowbite-react";
import Swal from "sweetalert2";
import CrearUsuarioModal from "../src/pages/CrearUsuarioModal";
import EditarUsuarioModal from "../src/pages/EditarUsuarioModal";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { getUserFromToken } from "../src/utils/getUserFromToken";

function UsuariosDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const navigate = useNavigate();
  const currentUser = getUserFromToken();

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        await fetchUsuarios();
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          confirmButtonColor: "#3b82f6",
        });
      } catch (err) {
        console.error("Error eliminando usuario:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-violet-800">Usuarios del sistema</h1>

        <div className="flex gap-3">
          {currentUser.role === "admin" && (
            <Button
              onClick={() => setShowCrearModal(true)}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-md hover:scale-105 transition"
            >
              ➕ Crear nuevo usuario
            </Button>
          )}

          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <span className="text-xl">⬅️</span>
            <span className="text-sm">Volver</span>
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Spinner size="xl" color="purple" />
        </div>
      ) : usuarios.length === 0 ? (
        <p className="text-gray-600">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <Table striped hoverable className="min-w-full">
            <Table.Head>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Rol</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {usuarios.map((usuario) => {
                const puedeEditar =
                currentUser.role === "admin" || currentUser._id === usuario._id;
                const puedeEliminar = currentUser.role === "admin";
                const esMiPerfil = currentUser._id === usuario._id;

                return (
                  <Table.Row
                    key={usuario._id}
                    className="bg-white hover:bg-gray-100 transition"
                  >
                    <Table.Cell className="font-medium text-gray-900">
                      {usuario.email}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={usuario.role === "admin" ? "purple" : "gray"}>
                        {usuario.role}
                      </Badge>
                    </Table.Cell>
                    {/* <Table.Cell>
                      <Badge color={usuario.plan === "premium" ? "success" : "info"}>
                        {usuario.plan}
                      </Badge>
                    </Table.Cell> */}
                    <Table.Cell className="flex gap-3">
                      <button
                        className={`text-blue-600 hover:text-blue-800 transition text-xl ${
                          !puedeEditar ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                        disabled={!puedeEditar}
                        title="Editar"
                        onClick={() => puedeEditar && setUsuarioAEditar({ ...usuario, esMiPerfil })}
                      >
                        ✏️
                      </button>

                      <button
                        className={`text-red-600 hover:text-red-800 transition text-xl ${
                          !puedeEliminar ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                        disabled={!puedeEliminar}
                        title="Eliminar"
                        onClick={() => puedeEliminar && handleEliminar(usuario._id)}
                      >
                        🗑️
                      </button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      )}

      {showCrearModal && (
        <CrearUsuarioModal
          onClose={() => setShowCrearModal(false)}
          onSuccess={() => {
            setShowCrearModal(false);
            fetchUsuarios();
          }}
        />
      )}

{usuarioAEditar && (
  <EditarUsuarioModal
    usuario={usuarioAEditar}
    usuarioLogueado={currentUser} // ⚠️ Asegurate de pasar esto
    onClose={() => setUsuarioAEditar(null)}
    onSuccess={() => {
      setUsuarioAEditar(null);
      fetchUsuarios();
    }}
  />
)}
    </div>
  );
}

export default UsuariosDashboard;
