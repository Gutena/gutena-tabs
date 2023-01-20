/**
 * Get dynamic component
 */
import ColorControl from  './ColorControl';
import BoxShadowControl from  './BoxShadowControl';

const GetComponent = ( props ) => {
    const {
        componentName = '',
    } = props;

    if ( 'ColorControl' === componentName ) {
        return(
            <ColorControl { ...props } />
        );
    }

    if ( 'BoxShadowControl' === componentName ) {
        return(
            <BoxShadowControl { ...props } />
        );
    }
}

export default GetComponent;