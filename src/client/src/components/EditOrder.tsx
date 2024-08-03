import styled from 'styled-components';
import {type OrderType} from '../features/orders/ordersSlice';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateSingleOrder} from '../features/singleOrder/singleOrderThunk';
import {useParams} from 'react-router-dom';

interface EditOrderProps {
    singleOrder: OrderType
}

const EditOrder: React.FunctionComponent<EditOrderProps> = ({singleOrder}) => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {editOrderLoading} = useSelector((store: useSelectorType) => store.singleOrder);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('status', (target.elements.namedItem('status') as HTMLSelectElement).value);
        formData.append('message', (target.elements.namedItem('message') as HTMLTextAreaElement).value);
        dispatch(updateSingleOrder({orderID: id!, orderData: formData}));
    }
    return (
        <Wrapper>
            <h1 className="edit-order tCenter">Edit Order</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" defaultValue={singleOrder!.status} required>
                        <option value="paid">Paid</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" defaultValue={singleOrder!.message} required></textarea>
                </div>
                <button type="submit" disabled={editOrderLoading}>{editOrderLoading ? 'Editing' : 'Edit'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding:50px 20px;
    .edit-order {
        
    }
    form {
        width:50%;
        margin:auto;
        label {
            display:block;
            margin-top:15px;
            margin-bottom:15px;
        }
        select, textarea, button {
            padding:10px;
            border-radius:0px;
        }
        textarea {
            resize: none;
            height: 100px;
            border-radius:0px;
            background-color:#f9f9f9;
            border:1px solid #eeeeee;
        }
        select, textarea {
            width: 100%;    
        }
        button {
            color:#FFFFFF;
            padding:10px 60px;
            border-width:0px;
            margin-top: 15px;
            background-color:#000000;
        }
    }
`;

export default EditOrder;