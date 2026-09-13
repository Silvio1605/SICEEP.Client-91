import {
    Document,
    Page,
    Text,
    View,
} from '@react-pdf/renderer';
import {
    nombreCompletoPersona,
} from '../utils/expedienteMappers';
import {
    estilos,
    formatearFecha,
} from '../../reportes/pdf/constanciaBase';
import {
    EncabezadoConstancia,
    FirmaConstancia,
    PieConstancia,
} from '../../reportes/pdf/ConstanciaComun';

export default function ConstanciaPDF({ datosExpediente, config }) {
    const persona = datosExpediente?.persona || {};
    const contrato = datosExpediente?.contrato || {};
    const plaza = datosExpediente?.plaza || {};

    const nombre = nombreCompletoPersona(persona) || 'NOMBRE NO DISPONIBLE';
    const cedula = persona.cedula || 'NO DISPONIBLE';
    const numeroEmpleado = datosExpediente?.codigo || 'NO DISPONIBLE';
    const numInss = datosExpediente?.numInss || contrato?.numInss || 'NO DISPONIBLE';
    const cargo = plaza?.cargo || 'NO DISPONIBLE';
    const ubicacion = plaza?.estructura || 'NO DISPONIBLE';
    const unidad = plaza?.unidad || 'NO DISPONIBLE';
    const fechaIngreso = formatearFecha(datosExpediente?.fechaIngreso || contrato?.fechaInicio);

    const { mostrarSalario = false } = config || {};

    const salarioMensual = mostrarSalario
        ? (plaza?.salario ?? contrato?.salarioMensual ?? 0)
        : 0;

    return (
        <Document title={`Constancia ${nombre}`}>
            <Page size="LETTER" style={estilos.page}>
                {/* Encabezado */}
                <EncabezadoConstancia titulo="CONSTANCIA" />

                {/* Cuerpo */}
                <Text style={estilos.cuerpo}>
                    El suscrito Responsable de la Oficina de Registro y Control, hace constar que:
                </Text>
                <Text style={estilos.nombreNegrita}>{nombre}</Text>
                <Text style={estilos.cuerpo}>
                    Es funcionario de esta institución y aparece en nuestro registro con los siguientes datos:
                </Text>

                {/* Tabla de datos */}
                <View style={estilos.tabla}>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. Cédula:</Text></View>
                        <View style={estilos.celdaValor}><Text>{cedula}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. Empleado:</Text></View>
                        <View style={estilos.celdaValor}><Text>{numeroEmpleado}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. INSS:</Text></View>
                        <View style={estilos.celdaValor}><Text>{numInss}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Cargo:</Text></View>
                        <View style={estilos.celdaValor}><Text>{cargo}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Ubicación:</Text></View>
                        <View style={estilos.celdaValor}><Text>{ubicacion}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Unidad Administrativa:</Text></View>
                        <View style={estilos.celdaValor}><Text>{unidad}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Fecha de Ingreso:</Text></View>
                        <View style={estilos.celdaValor}><Text>{fechaIngreso}</Text></View>
                    </View>
                    {mostrarSalario && (
                        <View style={estilos.fila}>
                            <View style={estilos.celdaLabel}><Text>Salario Mensual:</Text></View>
                            <View style={estilos.celdaValor}>
                                <Text>C$ {Number(salarioMensual || 0).toLocaleString('es-NI', { maximumFractionDigits: 2 })}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Firma */}
                <FirmaConstancia config={config} />

                {/* Pie */}
                <PieConstancia config={config} />
            </Page>
        </Document>
    );
}