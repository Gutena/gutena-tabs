// Check if variable is numeric or not
export const isNumericVar = n => ! isNaN( parseFloat( n ) ) && isFinite( n );

// document Ready
export const gutenakitDocReady = fn => {
	// see if DOM is already available
	if (
		document.readyState === 'complete' ||
		document.readyState === 'interactive'
	) {
		// call on next available tick
		setTimeout( fn, 1 );
	} else {
		document.addEventListener( 'DOMContentLoaded', fn );
	}
};

//Camel case to dash name
export const gkCamelToDash = str => str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);

//Dash to camel case name
export const gkDashToCamel = str => str.replace(/(\-[a-z])/g, val => val.toUpperCase().replace('-',''));

/* search key value index in array of object
arrObj: array of object 
key: search key
value: search value
Return : index of first match or -1 on fail
*/
export const gkSearchArrObj = ( arrObj, key, value ) => {
	if ( gkIsEmpty( arrObj ) || ! Array.isArray( arrObj ) || 0 === arrObj.length  ) {
		return -1;
	}

	//Register existing block edit controls by custom componenet 
	for (let i = 0; i < arrObj.length; i++) {
		if ( arrObj[i][key] === value ) {
			return i; 
		} 
	}

	return -1;
}

/* get value of a key of matched key value obect in array of object
arrObj: array of object 
key: search key for match
value: search value for match
findKeyValue: key whose value to be find 
Return : value of first match index object key or false on fail
e.g arrObj = [{a:'xyz',b:'pqr'},{a:'x1yz',b:'pq1r'},{a:'x2yz',b:'pq2r'}]
getMatchArrObjKeyValue(arrObj,'a','x1yz','b') will return value of b i.e. pq1r
*/
export const getMatchArrObjKeyValue = ( arrObj, key, value, findKeyValue ) =>  {
	let index = gkSearchArrObj( arrObj, key, value );
	return ( -1 === index ) ? false: arrObj[ index ][ findKeyValue ];
}

//Check if empty
export const gkIsEmpty = data => 'undefined' === typeof data || null === data || '' === data;

//Get parent HTML elemnet
export const getParents = ( el, query ) => {
	let parents = [];
	while ( el.parentNode !== document.body ) {
		el.matches( query ) && parents.push( el );
		el = el.parentNode;
	}
	return parents;
};

//Slug 
export const generateSlug = ( name ) => gkIsEmpty( name ) ? '' : name.trim().toLowerCase().replace(/\s+/g, "-");


//Get editor document: used in responsive preview
export const getEditorDoc = ( query = '', multiple = false ) => {
	const frames = window.frames;
	let editorDoc = '';
	for ( let i = 0; i < frames.length; i++ ) {
		if (
			! gkIsEmpty( frames[ i ].name ) &&
			'editor-canvas' === frames[ i ].name
		) {
			editorDoc = frames[ i ].document;
			if ( ! gkIsEmpty( query ) ) {
				editorDoc = multiple
					? editorDoc.querySelectorAll( query )
					: editorDoc.querySelector( query );
			}
		}
	}

	return editorDoc;
};

//Check
export const hasClass = ( element, className ) => {
	return (
		( ' ' + element.className + ' ' ).indexOf( ' ' + className + ' ' ) > -1
	);
};

export const toggleClass = ( element, class1, class2 ) => {
	if ( hasClass( element, class1 ) ) {
		element.classList.remove( class1 );
		element.classList.add( class2 );
	} else {
		element.classList.remove( class2 );
		element.classList.add( class1 );
	}
};

export const toogleStyleDisplay = element => {
	if ( gkIsEmpty( element ) || element.length < 1 ) {
		return false;
	}

	if ( element.style.display === 'none' ) {
		element.style.display = 'block';
	} else {
		element.style.display = 'none';
	}
};

//Generate box shadow css
export const boxShadowCss = ( boxShadow, generateCss = true, colorGradientSettings = null ) => {
	let data;
	if (
		gkIsEmpty( boxShadow ) ||
		gkIsEmpty( boxShadow?.onBoxShadow ) ||
		gkIsEmpty( boxShadow?.offsetX ) ||
		gkIsEmpty( boxShadow?.offsetY ) ||
		gkIsEmpty( boxShadow?.color ) ||
		! boxShadow?.onBoxShadow	
	) {
		return '';
	} else {
		data = `${ boxShadow?.offsetX } ${ boxShadow?.offsetY } ${ ! gkIsEmpty( boxShadow?.blurRadius ) ? boxShadow?.blurRadius : `` } ${ ! gkIsEmpty( boxShadow?.spreadRadius ) ? boxShadow?.spreadRadius : `` } ${ gkIsEmpty( boxShadow?.color ) ? ``: getGlobalColorVar( colorGradientSettings, boxShadow?.color ) } ${ ! gkIsEmpty( boxShadow?.inset ) && boxShadow?.inset ? `inset` : `` }`;
	}

	if ( generateCss ) {
		return `box-shadow: ${ data };`;
	}

	return data;
};

//Generate padding|margin css: spacing: value, spaceName: padding|margin
export const spaceCss = ( spacing, spaceName ) => {
	if ( gkIsEmpty( spacing ) ) {
		return ``;
	}

	return ['top','right','bottom','left'].map( (side) => ( gkIsEmpty( spacing[side] ) ? '':  spaceName+'-'+side+':'+spacing[side]+' !important; ') ).join(' ');
}

//Generate padding|margin css var: spacing: value, varName: css var name
export const spaceVar = ( spacing, varName ) => {
	if ( gkIsEmpty( spacing ) ) {
			return ``;
	  }

	return ['top','right','bottom','left'].map( (side) => ( gkIsEmpty( spacing[side] ) ? '':  varName+'-'+side+':'+spacing[side]+'; ') ).join(' ');
}

//Generate border css var borderVar={border:{},radius:2px}, varName = css var
export const borderVar = ( borderVar , varName, colorGradientSettings = null ) => {
    let css = '';
	if ( ! gkIsEmpty( borderVar?.border ) ) {
		let border = borderVar.border;
        css = gkIsEmpty( border.color) ? ( [ 'top', 'right', 'bottom', 'left' ].map( side => (`
            ${ gkIsEmpty( border[side] ) ? `` : `${ varName }-${ side } : ${ border[side]?.width } ${ gkIsEmpty( border[side]?.style ) ? 'solid' : border[side]?.style } ${ gkIsEmpty( border[side]?.color ) ? `` : getGlobalColorVar( colorGradientSettings, border[side]?.color ) };` }
        `) ).join(' ') ) : ( `${ varName }: ${ border?.width } ${ gkIsEmpty( border?.style ) ? 'solid': border?.style } ${ gkIsEmpty( border?.color ) ? `` : getGlobalColorVar( colorGradientSettings, border?.color )};`);
	}
	
	if ( ! gkIsEmpty( borderVar?.radius ) ) {
        let radius = borderVar.radius;
        css = css + ` ${ varName }-radius: ${ radius?.top } ${ radius?.right } ${ radius?.bottom } ${ radius?.left };`;
    }

	return css;
};

//Generate border css
export const borderCss = ( borderVar ) => {
    let css = '';
	if ( ! gkIsEmpty( borderVar?.border ) ) {
		let border = borderVar.border;
        css = gkIsEmpty( border.color ) ? ( [ 'top', 'right', 'bottom', 'left' ].map( side => (`
            ${ gkIsEmpty( border[side] ) ? `` : `border-${ side }: ${ border[side]?.width } ${ gkIsEmpty( border[side]?.style ) ? 'solid': border[side]?.style } ${ border[side]?.color } !important; ` }
        `) ).join(' ') ) : ( `border: ${ border?.width } ${ gkIsEmpty( border?.style ) ? 'solid': border?.style } ${border?.color} !important;` );
	}

	if ( ! gkIsEmpty( borderVar?.radius ) ) {
        let radius = borderVar.radius;
        css = css + ` border-radius: ${ radius?.top } ${ radius?.right } ${ radius?.bottom } ${ radius?.left } !important;`;
    }

	return css;
};

//Generate typographyCss
export const typographyCss = ( typography, varName = null ) => {
	if ( gkIsEmpty( typography ) ) {
		return '';
	}
	let fontSize = null;

	let min_max_var = '';
	//Fluid font size
	if ( typography.fluidTypography && ! gkIsEmpty( typography.fontSize ) && ( ! gkIsEmpty( typography.MfontSize ) || ! gkIsEmpty( typography.TfontSize )  ) ) {
		let maxFontSize = typography.fontSize;
		let minFontSize = gkIsEmpty( typography.MfontSize ) ? typography.TfontSize : typography.MfontSize;
		//All units should be in rem
		let maxUnit = maxFontSize.replace(/[0-9]/g, ''); //replace number with empty string
		let minUnit = minFontSize.replace(/[0-9]/g, '');
		maxFontSize = maxFontSize.replace(/[a-z]/g, '');
		minFontSize = minFontSize.replace(/[a-z]/g, '');
		let allowedUnit = ['px','em','rem'];
		if ( -1 !== allowedUnit.indexOf( maxUnit ) && -1 !== allowedUnit.indexOf( minUnit ) ) {
			// maxFontSize = (( 'px' === maxUnit ) ? (parseInt( maxFontSize )/16) : maxFontSize)+'rem' ;
			// minFontSize = (( 'px' === minUnit ) ? (parseInt( minFontSize )/16) : minFontSize)+'rem';
			//https://websemantics.uk/tools/responsive-font-calculator/
			//$linear_factor = 100 * ( ( $maximum_font_size['value'] - $minimum_font_size['value'] ) / ( $maximum_viewport_width['value'] - $minimum_viewport_width['value'] ) )
			// let linear_factor = ( 100 * ( parseInt(maxFontSize) - parseInt(minFontSize) )/(100-48) );
			// fontSize = 'clamp('+minFontSize+', calc('+minFontSize+' + ((1vw - 0.48rem) * '+linear_factor+')), '+maxFontSize+')';

			//Min Max var
			min_max_var = gkIsEmpty( varName ) ? '': varName+'-min-font-size:'+minFontSize+'; '+varName+'-max-font-size:'+maxFontSize+'; ';
		}
	}

	if ( typography.fluidTypography && ! gkIsEmpty( typography.fluidFontSize ) ) {
		fontSize = typography.fluidFontSize;
	}
	

	varName = gkIsEmpty( varName ) ? '': varName+'-';
	//font properties
	return ['fontFamily', 'fontSize', 'lineHeight', 'fontStyle', 'fontWeight', 'letterSpacing', 'textTransform', 'textDecoration' ].map( ( fontProperty ) => {
		if ( 'fontSize' === fontProperty && !gkIsEmpty( fontSize ) ) {
			//Fluid typography
			return min_max_var+' '+varName+'font-size:'+fontSize+';';
		} else  if ( 'fontSize' === fontProperty && !gkIsEmpty( typography?.fontSize ) && 10 < typography.fontSize.length ) {
			//font size use theme font-size preset here which will use as a class
			return '';
		} else  {
			return gkIsEmpty( typography?.[fontProperty] ) ? '': varName+gkCamelToDash( fontProperty )+':' + typography[fontProperty]+';';
		} 
	}).join(' ');
};

//Generate typographyCss
export const typographyVar = ( typography, varName = null ) => {
	if ( gkIsEmpty( typography ) ) {
		return '';
	}
	let fontSize = null;

	let css = '';
	//Fluid font size
	if ( ! gkIsEmpty( varName ) && typography.fluidTypography && ! gkIsEmpty( typography.fontSize ) && ( ! gkIsEmpty( typography.MfontSize ) || ! gkIsEmpty( typography.TfontSize )  ) ) {
		let maxFontSize = typography.fontSize;
		let minFontSize = gkIsEmpty( typography.MfontSize ) ? typography.TfontSize : typography.MfontSize;
		//All units should be in rem
		let maxUnit = maxFontSize.replace(/[0-9]/g, ''); //replace number with empty string
		let minUnit = minFontSize.replace(/[0-9]/g, '');
		maxFontSize = maxFontSize.replace(/[a-z]/g, '');
		minFontSize = minFontSize.replace(/[a-z]/g, '');
		let allowedUnit = ['px','em','rem'];
		if ( -1 !== allowedUnit.indexOf( maxUnit ) && -1 !== allowedUnit.indexOf( minUnit ) ) {
			maxFontSize = (( 'px' === maxUnit ) ? (parseInt( maxFontSize )/16) : maxFontSize)+'rem' ;
			minFontSize = (( 'px' === minUnit ) ? (parseInt( minFontSize )/16) : minFontSize)+'rem';
			//Min Max var
			css +=  varName+'-min-font-size:'+minFontSize+'; '+varName+'-max-font-size:'+maxFontSize+'; ';
		}
	}
	
	if ( typography.fluidTypography && ! gkIsEmpty( typography.fluidFontSize ) ) {
		fontSize = typography.fluidFontSize;
	} else {
		css +=  gkIsEmpty( typography.MfontSize ) ? '': varName+'-m-font-size:'+typography.MfontSize+'; ';
		css +=  gkIsEmpty( typography.TfontSize ) ? '': varName+'-t-font-size:'+typography.TfontSize+'; ';
		css +=  gkIsEmpty( typography.MlineHeight ) ? '': varName+'-m-line-height:'+typography.MlineHeight+'; ';
		css +=  gkIsEmpty( typography.TlineHeight ) ? '': varName+'-t-line-height:'+typography.TlineHeight+'; ';
	}
	

	
	//font properties
	css += ['fontFamily', 'fontSize', 'lineHeight', 'fontStyle', 'fontWeight', 'letterSpacing', 'textTransform', 'textDecoration' ].map( ( fontProperty ) => {
		if ( 'fontSize' === fontProperty && !gkIsEmpty( fontSize ) ) {
			//Fluid typography
			return varName+'-font-size:'+fontSize+';';
		} else  if ( 'fontSize' === fontProperty && !gkIsEmpty( typography?.fontSize ) && 10 < typography.fontSize.length ) {
			//font size use theme font-size preset here which will use as a class
			return '';
		} else  {
			return gkIsEmpty( typography?.[fontProperty] ) ? '': varName+'-'+gkCamelToDash( fontProperty )+':' + typography[fontProperty]+';';
		} 
	}).join(' ');

	return css;
};

export const fluidSpacing = ( min, max ) => {
	let spacing = '';
	if (  ! gkIsEmpty( min ) && ! gkIsEmpty( max ) ) {
		//All units should be in rem
		let maxUnit = max.replace(/[0-9]/g, ''); //replace number with empty string
		let minUnit = min.replace(/[0-9]/g, '');
		//replace decimal with empty string
		maxUnit = maxUnit.replace('.', '');
		minUnit = minUnit.replace('.', '');

		max = max.replace(/[a-z]/g, '');
		min = min.replace(/[a-z]/g, '');
		let allowedUnit = ['px','em','rem'];
		if ( -1 !== allowedUnit.indexOf( maxUnit ) && -1 !== allowedUnit.indexOf( minUnit ) ) {
			max = (( 'px' === maxUnit ) ? (parseInt( max )/16) : max)+'rem' ;
			min = (( 'px' === minUnit ) ? (parseInt( min )/16) : min)+'rem';
			//https://websemantics.uk/tools/responsive-font-calculator/
			//$linear_factor = 100 * ( ( $maximum_font_size['value'] - $minimum_font_size['value'] ) / ( $maximum_viewport_width['value'] - $minimum_viewport_width['value'] ) )
			let linear_factor = ( 100 * ( parseInt(max) - parseInt(min) )/(100-48) ).toFixed(2);
			spacing = 'clamp('+min+', calc('+min+' + ((1vw - 0.48rem) * '+linear_factor+')), '+max+')';
		}
	}
	return spacing;
}

/**
 * 
 * @param {*} obj 
 * @returns string: joined values of object
 */
export const joinObjectValues = ( obj ) => {
	if ( gkIsEmpty( obj ) ) {
		return '';
	}
	let joinedValues = '';
	Object.values( obj ).forEach( function( val ) { 
		if( ! gkIsEmpty( val ) && 'string' === typeof val ) {
			joinedValues += val;
		}
	});
	return joinedValues;
}

//convert css into json
export const gkCssJson = ( cssVar ) => {
	if ( gkIsEmpty( cssVar ) ) {
		return {};
	}
	//remove spaces
	cssVar = cssVar.replace(' ', '');
	cssVar = cssVar.replace(/\n/g, " ");

	//convert into array e.g. --gutenakit-css-property:value;
	let cssJson = {};
	cssVar.split(';').forEach( itemVar => {
		
		//split --gutenakit-css-property:value
		let itemArray = itemVar.split(':');

		if ( ! gkIsEmpty( itemArray ) && 1 < itemArray.length ) {
			itemArray[0] = itemArray[0].trim();
			itemArray[0] = itemArray[0].replace('--gutenakit--', '');
			itemArray[0] = itemArray[0].replace('--', '-');
			cssJson[ itemArray[0] ] = itemArray[1].trim();
		}
		
	});

	return cssJson;
}

/**Get global typography css */
export const getGlobalTypographyCss = ( gutena_kit_block_editor ) => {
	let cssDefault = '';
	if ( ! gkIsEmpty( gutena_kit_block_editor?.globalTypography ) ) {
		let cssTab = '';
		let cssMobile = '';
        let preVar = 'gt-';
		 
		//Media size
		let media_query_tab = gkIsEmpty( gutena_kit_block_editor?.media_query_tab ) ?'1080px': gutena_kit_block_editor.media_query_tab;
		let media_query_mobile = gkIsEmpty( gutena_kit_block_editor?.media_query_mobile ) ?'767px': gutena_kit_block_editor.media_query_mobile;

		//console.log("gutena_kit_block_editor.globalTypography",gutena_kit_block_editor.globalTypography);
		Object.keys( gutena_kit_block_editor.globalTypography ).forEach( typographyGroup =>{ 
			let groupTypography = gutena_kit_block_editor.globalTypography[typographyGroup];
			
			//console.log("groupTypography",groupTypography);
			Object.keys( groupTypography ).forEach( slug =>{ 
				if ( ! gkIsEmpty( groupTypography[slug]?.['cssJson'] ) ) {
					let cssFont = '';
					let cssJson = groupTypography[slug]['cssJson'];
					
					//Default typography
					[ 'font-size', 'line-height', 'font-family', 'font-style', 'font-weight', 'letter-spacing', 'text-transform', 'text-decoration' ].forEach( ( font_property ) => {
						if ( ! gkIsEmpty( cssJson?.[preVar+''+font_property] ) ) {
							cssFont += ' '+font_property+':'+cssJson[preVar+''+font_property] +' !important;';
						}
					});
					
					if ( !gkIsEmpty( cssFont ) ) {
						cssDefault += '.editor-styles-wrapper .has-gutenakit-gt-'+slug+'{'+cssFont+'} ';
					}

				
					//tablet typography
					cssFont = '';
					[ 'font-size', 'line-height' ].forEach( ( font_property ) => {
						if ( ! gkIsEmpty( cssJson?.[preVar+'t-'+font_property] ) ) {
							cssFont += ' '+font_property+':'+cssJson[preVar+'t-'+font_property] +' !important;';
						}
					});
					if ( !gkIsEmpty( cssFont ) ) {
						cssTab += '.editor-styles-wrapper .has-gutenakit-gt-'+slug+'{'+cssFont+'} ';
					}

					//mobile typography
					cssFont = '';
					[ 'font-size', 'line-height' ].forEach( ( font_property ) => {
						if ( ! gkIsEmpty( cssJson?.[preVar+'m-'+font_property] ) ) {
							cssFont += ' '+font_property+':'+cssJson[preVar+'m-'+font_property] +' !important;';
						}
					});
					if ( !gkIsEmpty( cssFont ) ) {
						cssMobile += '.editor-styles-wrapper .has-gutenakit-gt-'+slug+'{'+cssFont+'} ';
					}
				}

			});
		});

		if ( !gkIsEmpty( cssTab ) ) {
			cssDefault += ' @media only screen and (min-width: 768px) and (max-width: '+media_query_tab+') { '+cssTab+'} ';
		}

		if ( !gkIsEmpty( cssMobile ) ) {
			cssDefault += ' @media only screen and (min-width: 768px) and (max-width: '+media_query_mobile+') { '+cssMobile+'} ';
		}
	}
	
	return cssDefault;
}
/* To Fix mobile and tablet preview due to a wordpress bug
	In mobile and tablet preview WP editor use iframe which cause css fall outside of iframe 
*/
export const renderBlockCSSForResponsive = ( gutena_kit_block_editor , deviceType = 'Desktop' ) => {

	if ( gkIsEmpty( gutena_kit_block_editor?.globalTypography ) ) {
		return false;
	}

	let editorDoc = null;
	let gkInnerHtml = false;

	if ( 'Desktop' !== deviceType ) {
		editorDoc =  getEditorDoc( '#gutena-tabs-settings-css' );
		if ( ! gkIsEmpty( editorDoc ) ) {
			gkInnerHtml = true;
		} else {
			//Get editor iframe document
			editorDoc = getEditorDoc( '.editor-styles-wrapper' );
		}
	}else{
		editorDoc =  document.querySelector('#gutena-tabs-settings-css');
		if ( ! gkIsEmpty( editorDoc ) ) {
			gkInnerHtml = true;
		} else {
			editorDoc = document.querySelector('.editor-styles-wrapper');
		}
	}

	if ( ! gkIsEmpty( editorDoc ) ) {
		if ( gkInnerHtml ) {
			//Update
			editorDoc.innerHTML = getGlobalTypographyCss( gutena_kit_block_editor );
		} else {
			//add
			editorDoc.insertAdjacentHTML('afterend','<style id="gutena-tabs-settings-css">'+getGlobalTypographyCss( gutena_kit_block_editor )+'</style>');
		}
	}

	return '';
}

/**
 * Get global color as var if use global variable
 */
export const getGlobalColorVar = ( colorGradientSettings, color ) => {
	if ( gkIsEmpty( colorGradientSettings ) || gkIsEmpty( colorGradientSettings?.colors ) || gkIsEmpty( color ) || 15 < color.length ) {
		return color;
	}
	let colorSlug = '';
	colorGradientSettings.colors.forEach( ( colorGroup ) => {
		//break if found colorSlug
		if ( ! gkIsEmpty( colorSlug ) ) {
			return;
		}
		if ( ! gkIsEmpty( colorGroup?.colors ) && ! gkIsEmpty( colorGroup?.name ) ) {
			colorGroup.colors.forEach( ( colorObj ) => { 
				//break if found colorSlug
				if ( ! gkIsEmpty( colorSlug ) ) {
					return;
				}
				if ( ! gkIsEmpty( colorObj?.color ) && ! gkIsEmpty( colorObj?.slug ) && color === colorObj.color ) { 
					colorSlug = ( "custom" === colorGroup.name.toLowerCase() )? 'custom-'+colorObj.slug: colorObj.slug;
				}
			});
		}
   });

   if ( ! gkIsEmpty( colorSlug ) ) {
	return 'var(--wp--preset--color--'+colorSlug+','+color+')';
   } else if ( ! gkIsEmpty( colorGradientSettings?.gradients
	) ) {
		//Match for gradient
		colorGradientSettings.gradients.forEach( ( gradientsGroup ) => {
			//break if found colorSlug
			if ( ! gkIsEmpty( colorSlug ) ) {
				return;
			}
			if ( ! gkIsEmpty( gradientsGroup?.gradients ) && ! gkIsEmpty( gradientsGroup?.name ) ) {
				gradientsGroup.gradients.forEach( ( gradientsObj ) => { 
					//break if found colorSlug
					if ( ! gkIsEmpty( colorSlug ) ) {
						return;
					}

					if ( ! gkIsEmpty( gradientsObj?.gradient ) && ! gkIsEmpty( gradientsObj?.slug ) && color === gradientsObj.gradient ) { 
						colorSlug = ( "custom" === gradientsGroup.name.toLowerCase() ) ? 'custom-'+gradientsObj.slug: gradientsObj.slug;
					}

				});
			}
	   });
   }
   return gkIsEmpty( colorSlug ) ? color : 'var(--wp--preset--gradient--'+colorSlug+','+color+')';
}

export const getColorFromVar = ( colorVar ) => {

	if ( gkIsEmpty( colorVar ) || 15 > colorVar.length ) {
		return colorVar;
	}
	
	let color = colorVar.trim();
	//separator position: first ','
	let seprateorPos = color.indexOf(',');
	//if color value not found
	if ( -1 === seprateorPos) {
		return colorVar;
	}
	color = color.slice( seprateorPos+1, color.length -1 );
	return color.trim();
}