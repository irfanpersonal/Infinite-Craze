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
            <div className="edit-order">Edit Order</div>
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
    padding: 1rem;
    outline: 1px solid black;
    width: 50%;
    margin: 0 auto;
    margin-top: 1rem;
    .edit-order {
        text-align: center;
        background-color: black;
        color: white;
        padding: 0.5rem;
    }
    form {
        margin: 0 auto;
        label {
            display: block;
            margin-top: 0.25rem;
        }
        select, textarea, button {
            padding: 0.5rem;
        }
        textarea {
            resize: none;
            height: 100px;
        }
        select, textarea {
            width: 100%;    
        }
        button {
            width: 100%;
        }
    }
`;

export default EditOrder;