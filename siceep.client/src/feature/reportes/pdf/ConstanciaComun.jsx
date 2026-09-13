import {
    Image,
    Text,
    View,
} from '@react-pdf/renderer';
import logo from '../../../assets/Logo_p.png?inline';
import {
    estilos,
    formatearFechaFirma,
} from './constanciaBase';

export const EncabezadoConstancia = () => (
    <View style={estilos.header}>
        <Image src={logo} style={estilos.headerLogo} />
        <Text style={estilos.headerPais}>República de Nicaragua</Text>
        <Text style={estilos.headerInstitucion}>SEGURANICA S.A.</Text>
        <Text style={estilos.headerDivision}>DIVISIÓN DE PERSONAL</Text>
        <Text style={estilos.lema}>"Juntos con la Comunidad, Comprometidos con tu Seguridad."</Text>
        <Text style={estilos.headerTitulo}>CONSTANCIA</Text>
    </View>
);

export const FirmaConstancia = ({ config }) => {
    const {
        firmanteNombre = 'Ricardo Alonso Palacios',
        firmanteCargo = 'Jefe de la Oficina de Registro y Control',
        firmanteTitulo = 'Ingeniero',
        ciudad = 'Managua',
    } = config || {};

    return (
        <View style={estilos.firma}>
            <Text style={estilos.firmaLugar}>{formatearFechaFirma(ciudad)}</Text>
            <Text style={estilos.firmaTitulo}>{firmanteTitulo}</Text>
            <Text style={estilos.firmaNombre}>{firmanteNombre}</Text>
            <Text style={estilos.firmaCargo}>{firmanteCargo}</Text>
        </View>
    );
};

export const PieConstancia = ({ config }) => {
    const { numeroDocumento = 'C-0001' } = config || {};

    return (
        <View style={estilos.footer}>
            <Text style={estilos.footerLema}>HONOR, SEGURIDAD, SERVICIO</Text>
            <Text style={estilos.footerContacto}>
                COMPLEJO FAUSTINO RUIZ, COSTADO ESTE METROCENTRO, MANAGUA, teléfono: 22774130EXT1053
            </Text>
            <Text style={estilos.footerContacto}>
                SeguraNica S.A. - División de Personal Y Cuadros· {numeroDocumento}
            </Text>
        </View>
    );
};