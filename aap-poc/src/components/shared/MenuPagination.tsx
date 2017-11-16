import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

export interface MenuPaginationProps {
    pageIndex: number,
    pageSize: number,
    totalCount: number,
    onChangePage(pageIndex: number): void;
}

export class MenuPagination extends React.Component<MenuPaginationProps>{

    private normalizeNumber = (number: any, min: number, max: number, defaultValue: any) => {
        if (number == undefined || number == null || isNaN(number)) {
            return defaultValue;
        }

        if (number < min) {
            return min;
        }

        if (number > max) {
            return max;
        }

        return number;
    }

    private pushToArray = (array: number[], value: number) => {
        if (array.indexOf(value) < 0) {
            array.push(value);
        }
    }

    private calculatePageNumbers = (currentPageNo: number, pageCount: number) => {
        if (pageCount <= 4) {
            //Show all pages
            var pageNumbers = [];
            for (var i = 1; i <= pageCount; ++i) {
                pageNumbers.push(i);
            }

            return pageNumbers;
        } else {
            //show first three, last three, current, previous and next page numbers
            var shownPageNumbers = [1, 2, pageCount - 1, pageCount];
            var previousPageNo = this.normalizeNumber(currentPageNo - 1, 1, pageCount, 1);
            var nextPageNo = this.normalizeNumber(currentPageNo + 1, 1, pageCount, 1);

            this.pushToArray(shownPageNumbers, previousPageNo);
            this.pushToArray(shownPageNumbers, currentPageNo);
            this.pushToArray(shownPageNumbers, nextPageNo);

            shownPageNumbers.sort(function (a, b) { return a - b; });
            return shownPageNumbers;
        }
    }

    private createPageNumberMenuItems = (pageIndex: number, pageNumbers: number[]) => {
        let ret: JSX.Element[] = [];
        var previousNumber = 0;

        for (var i = 0; i < pageNumbers.length; i++) {
            //Create "..." between page numbers if needed
            if ((pageNumbers[i] - previousNumber) > 1) {
                ret.push(<Menu.Item disabled key={`${i}_sepa`} content='...' as='a' />);
            }
            ret.push(this.renderPageNumberButton(pageIndex, pageNumbers[i]));
            previousNumber = pageNumbers[i];
        }
        return ret;
    }

    private renderPageNumberButton = (pageIndex: number, pageNumber: number) => {
        return <Menu.Item
            onClick={e => this.handleChangePage(pageNumber)}
            active={pageIndex === pageNumber}
            key={pageNumber}
            content={pageNumber}
            as='a'>
        </Menu.Item>
    }

    private handleChangePage = (pageIndex: number) => {
        this.setState(prev => ({ pageIndex }), () => {
            if (this.props.onChangePage) this.props.onChangePage(pageIndex);
        });
    }

    shouldComponentUpdate(nextProps: MenuPaginationProps): boolean {
        return this.props.pageIndex !== nextProps.pageIndex ||
            this.props.pageSize !== nextProps.pageSize ||
            this.props.totalCount !== nextProps.totalCount;
    }

    render() {
        const { totalCount, pageIndex, pageSize } = this.props;
        const endPage = (totalCount && Math.ceil(totalCount / pageSize)) || 0;
        if (!endPage || (totalCount && totalCount <= pageSize)) return null;
        const items = this.createPageNumberMenuItems(pageIndex, this.calculatePageNumbers(pageIndex, endPage));
        return (
            <Menu pagination>
                <Menu.Item as='a' icon onClick={e => this.handleChangePage(1)} disabled={pageIndex <= 1} >
                    <Icon name='angle double left' />
                </Menu.Item>
                <Menu.Item as='a' icon onClick={e => this.handleChangePage(pageIndex - 1)} disabled={pageIndex <= 1}>
                    <Icon name='angle left' />
                </Menu.Item>
                {...items}
                <Menu.Item as='a' icon onClick={e => this.handleChangePage(pageIndex + 1)} disabled={pageIndex === endPage} >
                    <Icon name='angle right' />
                </Menu.Item>
                <Menu.Item as='a' icon onClick={e => this.handleChangePage(endPage)} disabled={pageIndex === endPage}>
                    <Icon name='angle double right' />
                </Menu.Item>
            </Menu>
        )
    }
}