import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { updateCollections } from '../../redux/shop/shop.actions';

import WithSpinner from '../../components/with-spinner/with-spinner.component';

import CollectionsOverview from '../../components/collections-overview/collections-overview.component';

import {
  firestore,
  convertCollectionsSnapshotToMap
} from '../../firebase/firebase.utils.js';
import CollectionPage from '../collection/collection.component';
import { ButtonsBarContainer } from '../../components/sign-in/sign-in.styles';
import CustomButton from '../../components/custom-button/custom-button.component';

const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

function ProductPage (props) {

  const [productId, setProductId] = useState('');
  const [foundItem, setFoundItem] = useState(null);
  const [state,setState]=useState({
    loading: true,
    lastVisible: null,
    hasMore: true
  });

  useEffect(async () => {

    const { match } = props;
    console.log(match.params)
    const productId = match.params.productId;
    console.log({productId});
    if (productId) {
      await findItemById(productId).then(setFoundItem);
    }
  }, [productId]);



  const findItemById = async (id) => {
    const ondcCatalogRef = firestore.collection('ondcCatalog');
    const querySnapshot = await ondcCatalogRef.get();
    let foundItem = null;

    var ids=[]

    querySnapshot.forEach((doc) => {
      const documentData = doc.data();
      if(documentData?.business_data?.items!=undefined) {
        const items  = documentData?.business_data?.items;
        console.log({documentData});
        for(var i=0;i<items?.length;i++){
          ids.push(items[i].id)
        }
        const item = items?.find((item) => item.id === id);
        if (item) {
          foundItem = { ...item, docId: doc.id };
        }
      }
    });
    console.log({ids})
    return foundItem;
  };

    const { match } = props;
    const { loading, hasMore } = state;
    return (
      <div className='product-page'>
       <h5 className="h1 total"> {JSON.stringify(foundItem)}</h5>
         <div className="location_id">{foundItem?.location_id}</div>
         <div className="returnable">{foundItem?.returnable}</div>
         <div className="parent_item_id">{foundItem?.parent_item_id}</div>
         <div className="fulfillment_id">{foundItem?.fulfillment_id}</div>
         <div className="cancellable">{foundItem?.cancellable}</div>
         <div className="short_desc">{foundItem?.short_desc}</div>
         <div className="time_to_ship">{foundItem?.time_to_ship}</div>
         <div className="cod_available">{foundItem?.cod_available}</div>
         <div className="code">{foundItem?.code}</div>
         <div className="long_desc">{foundItem?.long_desc}</div>
         <div className="symbol">{foundItem?.symbol}</div>
         <div className="return_window">{foundItem?.return_window}</div>
         <div className="id">{foundItem?.id}</div>
         <div className="images">{foundItem?.images}</div>
         <div className="support_contacts">{foundItem?.support_contacts}</div>
         <div className="mrp">{foundItem?.mrp}</div>
         <div className="composition">{foundItem?.composition}</div>
         <div className="seller_pickup_return">{foundItem?.seller_pickup_return}</div>
         <div className="price">{foundItem?.price}</div>
         <h1 className="item_name">{foundItem?.item_name}</h1>
         <div className="docId">{foundItem?.docId}</div>
      </div>
    );
  }

export default connect(
  null,
  null
)(ProductPage);
