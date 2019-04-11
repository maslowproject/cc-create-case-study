import * as React from 'react';
import { Map, loadModules } from '@esri/react-arcgis';
import { connect } from 'react-redux'

class SimpleMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      centerPoint: null,
      map: null,
      view: null,
      layers: []
    }
  }

  componentWillMount() {
    loadModules([
      'esri/layers/FeatureLayer',
      'esri/geometry/Point'
    ]).then(([ FeatureLayer, Point ]) => {
      var newPoint = new Point({ latitude: 29.754851, longitude: -95.482797 })
      const layers = this.buildFeatureLayers(FeatureLayer)

      this.setState({ centerPoint: newPoint, layers })
    })
  }

  buildFeatureLayers(FeatureLayer) {
    const labelClass = {
      // autocasts as new LabelClass()
      symbol: {
        type: "text",  // autocasts as new TextSymbol()
        color: "black",
        haloColor: "white",
        haloSize: 2,
        font: {  // autocast as new Font()
          // family: "playfair-display",
          size: 16,
          weight: "bold"
        }
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.ZIP_CODE"
      }
    }

    var zipLayer = new FeatureLayer({
      labelingInfo: [ labelClass ],
      renderer: {
        type: "simple",
        fill: {
          type: "simple-fill",
          outline: {
              cap: "round",
              width: 1,
              color: [255, 255, 255, 1]
          },
          color: [255, 255, 255, 0]
        }
      },
      url: "https://cohegis.houstontx.gov/cohgispub/rest/services/PD/Government_Boundaries_wm/MapServer/7",
      title: 'Zip Codes'
    });
    
    var citylimitLayer = new FeatureLayer({
      url: "https://cohegis.houstontx.gov/cohgispub/rest/services/PD/Government_Boundaries_wm/MapServer/0",
      title: 'City Limits'
    });

    var schoolLayer = new FeatureLayer({ 
      title: 'Schools',
      url: 'https://cohegis.houstontx.gov/cohgispub/rest/services/PD/Neighborhood_Services_wm/MapServer/0',
      popupTemplate: {
        title: '{CAMPNAME}',
        content: [{
          type: 'fields',
          fieldInfos: [
            { fieldName: 'CAMPNAME', label: 'Name' },
            { fieldName: 'DISTNAME', label: 'District' },
            { fieldName: 'USER_School_Site_Street_Address', label: 'Address' },
            { fieldName: 'USER_School_Site_City', label: 'City' },
            { fieldName: 'USER_School_Site_State', label: 'State' },
            { fieldName: 'USER_School_Site_Zip', label: 'Zip' },
            { fieldName: 'GRADERANGE', label: 'Grade Range' }

          ]
        }],
        outFields: ['USER_School_Principal', 'Email' ],
        actions: [{
          id: 'email-principal',
          title: 'Email Principal',
          className: 'esri-icon-contact'
        }]
      } })

      return [schoolLayer, citylimitLayer, zipLayer]
  }

  handleMapLoad = (map, view) => {
    const { selectedSchool } = this.props

    this.setState({ map, view }, () => {
      loadModules([
        'esri/widgets/Search',
        'esri/widgets/LayerList'
      ])
      .then(([
        Search,
        LayerList 
      ]) => {
        const layerlist = new LayerList({
          view: view,
          listItemCreatedFunction: function (event) {
            const item = event.item;
            if (item.layer.type !== "group"){ // don't show legend twice
              item.panel = {
                content: "legend"
              };
            }
          }
        })

        const schoolLayer = map.allLayers.find(function(layer) {
          return layer.title === "Schools";
         })

        var searchWidget = new Search({
          view,
          sources: [{
            featureLayer: schoolLayer,
            searchFields: ["CAMPNAME"],
            displayField: 'CAMPNAME',
            exactMatch: false,
            placeholder: 'Search for School'
          }],
          includeDefaultSources: false
        })

        view.ui.add(searchWidget, {
          position: 'top-left'
        })
        view.ui.add(layerlist, "top-right")
        view.ui.move("zoom", "bottom-left")

        view.when(() => {
          const popup = view.popup

          if (selectedSchool) view.goTo(selectedSchool)

          popup.watch('selectedFeature', (graphic) => {
            if (graphic) {
              var graphicTemplate = graphic.getEffectivePopupTemplate()

              graphicTemplate.actions.items[0].visible = graphic.attributes.Email ? true : false
            }
          })

          popup.viewModel.on('trigger-action', (event) => {
            if (event.action.id === 'email-principal') {
              const { Email, USER_School_Principal: Principal } = popup.viewModel.selectedFeature.attributes

              if (Email) {
                const url = `mailto:${Email}?subject=ATTN:%20${Principal ? Principal.trim() : 'Principal'}`

                window.location.href = url
              }
            }
          })
        })
      })
    })
  }

  render() {
    const { centerPoint, layers } = this.state
    return <Map 
      mapProperties={{ basemap: 'streets', layers }}
      viewProperties={{ center: centerPoint, zoom: 14 }}
      onLoad={this.handleMapLoad} />
  }
}

const mapStateToProps = state => ({
  selectedSchool: state.Map.geometry
})

export default connect(mapStateToProps)(SimpleMap);